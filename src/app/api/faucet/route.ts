import { NextResponse } from 'next/server';
import { isAddress, parseUnits } from 'viem';
import { getFaucetWallet, publicClient } from '@/lib/server/botchain';
import { MXNB_ABI } from '@/lib/abi/MockMXNB';
import { MXNB_ADDRESS, MXNB_DECIMALS } from '@/lib/constants';

// Amount of test MXNB dispensed per request.
const FAUCET_AMOUNT = 1000;
// Simple in-memory cooldown (best-effort; resets on cold start).
const COOLDOWN_MS = 60_000;
const lastClaim = new Map<string, number>();

export async function POST(request: Request) {
  try {
    const { address } = (await request.json()) as { address?: string };

    if (!address || !isAddress(address)) {
      return NextResponse.json({ error: 'Valid address required' }, { status: 400 });
    }

    const wallet = getFaucetWallet();
    if (!wallet) {
      return NextResponse.json(
        { error: 'Faucet not configured (set FAUCET_PRIVATE_KEY)' },
        { status: 503 },
      );
    }

    const key = address.toLowerCase();
    const last = lastClaim.get(key);
    if (last && Date.now() - last < COOLDOWN_MS) {
      return NextResponse.json(
        { error: 'Please wait before requesting more test MXNB' },
        { status: 429 },
      );
    }

    const hash = await wallet.writeContract({
      address: MXNB_ADDRESS,
      abi: MXNB_ABI,
      functionName: 'mint',
      args: [address as `0x${string}`, parseUnits(String(FAUCET_AMOUNT), MXNB_DECIMALS)],
    });
    lastClaim.set(key, Date.now());

    // Wait for inclusion so the client sees a usable balance immediately.
    await publicClient.waitForTransactionReceipt({ hash });

    return NextResponse.json({ success: true, txHash: hash, amount: FAUCET_AMOUNT });
  } catch (error) {
    console.error('Faucet error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Faucet failed' },
      { status: 500 },
    );
  }
}
