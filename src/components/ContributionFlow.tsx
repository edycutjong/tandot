'use client';

import React, { useState } from 'react';
import { parseUnits } from 'viem';
import {
  useAccount,
  useChainId,
  useSwitchChain,
  useWriteContract,
  usePublicClient,
  useReadContract,
} from 'wagmi';
import {
  formatMXNB,
  botScanUrl,
  ESCROW_ADDRESS,
  MXNB_ADDRESS,
  MXNB_DECIMALS,
  BOT_CHAIN_ID,
  NETWORK,
  toOnchainTandaId,
} from '@/lib/constants';
import { TANDA_ESCROW_ABI } from '@/lib/abi/TandaEscrow';
import { MXNB_ABI } from '@/lib/abi/MockMXNB';
import { ClientTranslation as TText } from '@/components/ui/ClientTranslation';

interface ContributionFlowProps {
  tandaId: string;
  amount: number;
  round?: number;
  /** Tanda members, used to resolve the connected wallet → member_id for logging. */
  members?: { id: string; wallet_address: string }[];
  onSuccess?: () => void;
}

type Step = 'initial' | 'approving' | 'depositing' | 'success';

function isUserRejection(error: unknown): boolean {
  const code = (error as { code?: number })?.code;
  const name = (error as { name?: string })?.name;
  return name === 'UserRejectedRequestError' || code === 4001;
}

export function ContributionFlow({ tandaId, amount, round, members, onSuccess }: ContributionFlowProps) {
  const [step, setStep] = useState<Step>(() => 'initial');
  const [txHash, setTxHash] = useState<string>(() => '');
  const [error, setError] = useState<string>(() => '');
  const [funding, setFunding] = useState<boolean>(() => false);

  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  const amountWei = parseUnits(String(amount), MXNB_DECIMALS);
  const onchainTandaId = toOnchainTandaId(tandaId);

  // Resolve the connected wallet to its membership so the contribution can be
  // logged against the right member. Only members can be logged to the DB.
  const memberId = address
    ? members?.find((m) => m.wallet_address?.toLowerCase() === address.toLowerCase())?.id
    : undefined;

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: MXNB_ADDRESS,
    abi: MXNB_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const hasFunds = typeof balance === 'bigint' && balance >= amountWei;

  const getTestMXNB = async () => {
    setFunding(true);
    setError('');
    try {
      const res = await fetch('/api/faucet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Faucet failed');
      await refetchBalance();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Faucet failed');
    } finally {
      setFunding(false);
    }
  };

  const handleContribute = async () => {
    if (!address || !publicClient) {
      setError('Connect your wallet first.');
      return;
    }
    setError('');
    try {
      // Make sure the wallet is on BOT Chain before sending anything.
      if (chainId !== BOT_CHAIN_ID) {
        await switchChainAsync({ chainId: BOT_CHAIN_ID });
      }

      // 1) Approve the escrow to pull `amount` MXNB.
      setStep('approving');
      const approveHash = await writeContractAsync({
        address: MXNB_ADDRESS,
        abi: MXNB_ABI,
        functionName: 'approve',
        args: [ESCROW_ADDRESS, amountWei],
      });
      await publicClient.waitForTransactionReceipt({ hash: approveHash });

      // 2) Deposit into the escrow for this tanda.
      setStep('depositing');
      const depositHash = await writeContractAsync({
        address: ESCROW_ADDRESS,
        abi: TANDA_ESCROW_ABI,
        functionName: 'deposit',
        args: [onchainTandaId, amountWei],
      });
      await publicClient.waitForTransactionReceipt({ hash: depositHash });

      setTxHash(depositHash);
      setStep('success');

      // 3) Best-effort: log the confirmed contribution to the DB.
      if (memberId) {
        fetch('/api/contributions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tanda_id: tandaId,
            member_id: memberId,
            round: round ?? 1,
            amount,
            botchain_tx_hash: depositHash,
          }),
        }).catch(() => {});
      }

      onSuccess?.();
    } catch (err) {
      if (isUserRejection(err)) {
        setStep('initial');
        return;
      }
      setError(err instanceof Error ? err.message : 'Transaction failed');
      setStep('initial');
    }
  };

  if (step === 'success') {
    return (
      <div className="glass-card wow-card p-6 border-emerald-500/30 bg-emerald-500/5 text-center animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-4">
          ✓
        </div>
        <h3 className="font-heading font-bold text-xl mb-2 text-emerald-400">
          <TText tKey="detail_confirmed" />
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>
          <TText tKey="contrib_success_msg" values={{ amount: formatMXNB(amount) }} />
        </p>
        <a
          href={botScanUrl(`tx/${txHash}`)}
          target="_blank"
          rel="noopener noreferrer"
          className="block p-3 bg-black/40 rounded-lg font-mono text-[10px] break-all mb-4 text-emerald-400/70 border border-emerald-500/20 hover:text-emerald-300 transition-colors"
        >
          {txHash} ↗
        </a>
        <button
          onClick={() => { setStep('initial'); setTxHash(''); }}
          className="btn-primary w-full py-3"
        >
          <TText tKey="contrib_btn_done" />
        </button>
      </div>
    );
  }

  const busy = step === 'approving' || step === 'depositing';

  return (
    <div className="glass-card wow-card p-6 overflow-hidden relative">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10">
        <h3 className="font-heading font-semibold text-lg mb-4 flex items-center gap-2">
          <span className="text-cyan-400">⚡</span>
          <TText tKey="contrib_title" />
        </h3>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
            <div>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}><TText tKey="contrib_amount_to_deposit" /></p>
              <p className="text-2xl font-mono font-bold text-cyan-400">{formatMXNB(amount)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}><TText tKey="contrib_currency" /></p>
              <p className="font-bold">MXNB</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                step === 'depositing' ? 'border-emerald-500 bg-emerald-500 text-black' : 'border-cyan-500 text-cyan-400'
              }`}>
                {step === 'depositing' ? '✓' : '1'}
              </div>
              <p className={`text-sm ${step === 'depositing' ? 'text-emerald-400' : 'text-white'}`}>
                <TText tKey="contrib_step_approve" />
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border ${
                step === 'depositing' ? 'border-cyan-500 text-cyan-400' : 'border-white/20 text-white/40'
              }`}>
                2
              </div>
              <p className={`text-sm ${step === 'depositing' ? 'text-white' : 'text-white/40'}`}>
                <TText tKey="contrib_step_deposit" />
              </p>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 mb-3 break-words">{error}</p>
        )}

        {/* No MXNB → offer the test faucet first (testnet only) */}
        {!busy && address && !hasFunds && NETWORK === 'testnet' && (
          <button
            onClick={getTestMXNB}
            disabled={funding}
            className="btn-secondary w-full py-3 mb-3 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait"
          >
            {funding && <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
            {funding ? 'Minting test MXNB…' : 'Get test MXNB'}
          </button>
        )}

        {!busy && (
          <button
            onClick={handleContribute}
            disabled={!address || !hasFunds}
            className="btn-primary w-full py-4 font-bold flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <TText tKey="contrib_btn_approve" />
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        )}

        {busy && (
          <button
            disabled
            className="btn-primary w-full py-4 font-bold flex items-center justify-center gap-3 opacity-80 cursor-wait"
          >
            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            {step === 'approving' ? <TText tKey="contrib_btn_approving" /> : <TText tKey="contrib_btn_depositing" />}
          </button>
        )}

        <p className="text-[10px] mt-4 text-center" style={{ color: 'var(--text-muted)' }}>
          <TText tKey="contrib_network_notice" />
        </p>
      </div>
    </div>
  );
}
