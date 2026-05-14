'use client';

import React, { useState } from 'react';
import { formatMXNB } from '@/lib/constants';
import { ClientTranslation as TText } from '@/components/ui/ClientTranslation';

interface ContributionFlowProps {
  tandaId: string;
  amount: number;
  onSuccess?: () => void;
}

type Step = 'initial' | 'approving' | 'depositing' | 'success';

export function ContributionFlow({ amount, onSuccess }: Omit<ContributionFlowProps, 'tandaId'>) {
  const [step, setStep] = useState<Step>(() => 'initial');
  const [txHash, setTxHash] = useState<string>(() => '');

  const handleApprove = async () => {
    setStep('approving');
    // Simulate approval delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    setStep('depositing');
    
    // Simulate deposit delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTxHash('0x' + Math.random().toString(16).slice(2, 66));
    setStep('success');
    
    if (onSuccess) onSuccess();
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
        <div className="p-3 bg-black/40 rounded-lg font-mono text-[10px] break-all mb-4 text-emerald-400/70 border border-emerald-500/20">
          {txHash}
        </div>
        <button 
          onClick={() => setStep('initial')}
          className="btn-primary w-full py-3"
        >
          <TText tKey="contrib_btn_done" />
        </button>
      </div>
    );
  }

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
                step === 'initial' ? 'border-cyan-500 text-cyan-400' : 'border-emerald-500 bg-emerald-500 text-black'
              }`}>
                {step === 'initial' ? '1' : '✓'}
              </div>
              <p className={`text-sm ${step === 'initial' ? 'text-white' : 'text-emerald-400'}`}>
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

        {step === 'initial' && (
          <button 
            onClick={handleApprove}
            className="btn-primary w-full py-4 font-bold flex items-center justify-center gap-2 group"
          >
            <TText tKey="contrib_btn_approve" />
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        )}

        {(step === 'approving' || step === 'depositing') && (
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
