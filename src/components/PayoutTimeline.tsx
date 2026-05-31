'use client';

import React from 'react';
import { formatMXNB, timeAgo } from '@/lib/constants';
import { Database } from '@/lib/supabase/database.types';
import { ClientTranslation as TText } from '@/components/ui/ClientTranslation';

type Payout = Database['public']['Tables']['payouts']['Row'];

interface PayoutTimelineProps {
  payouts: Payout[];
  currentRound: number;
}

export function PayoutTimeline({ payouts, currentRound }: PayoutTimelineProps) {
  // Sort payouts by round
  const sortedPayouts = [...payouts].sort((a, b) => a.round - b.round);

  return (
    <div className="space-y-4">
      <div className="relative pl-8 space-y-6">
        {/* Vertical connection line */}
        <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-white/10" />

        {sortedPayouts.map((payout) => {
          const isActive = payout.round === currentRound;
          const isCompleted = payout.status === 'completed';
          
          return (
            <div key={payout.id} className="relative">
              {/* Timeline dot */}
              <div 
                className={`absolute -left-8 w-7 h-7 rounded-full border-4 flex items-center justify-center z-10 transition-all duration-500 ${
                  isCompleted 
                    ? 'bg-emerald-500 border-emerald-500/30 text-black' 
                    : isActive 
                      ? 'bg-cyan-500 border-cyan-500/30 text-black pulse-live' 
                      : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                {isCompleted ? '✓' : payout.round}
              </div>

              <div className={`glass-card p-4 transition-all duration-300 ${
                isActive ? 'border-cyan-500/50 bg-cyan-500/5 shadow-[0_0_20px_rgba(6,182,212,0.1)] scale-[1.02]' : 'opacity-80'
              }`}>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        <TText tKey="payout_round" /> {payout.round}
                      </span>
                      {isActive && (
                        <span className="badge badge-active text-[10px] py-0 px-2">
                          <TText tKey="payout_current" />
                        </span>
                      )}
                    </div>
                    <p className="font-heading font-bold text-lg">
                      {formatMXNB(payout.amount)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`badge ${isCompleted ? 'badge-confirmed' : 'badge-pending'}`}>
                      {isCompleted ? <TText tKey="payout_paid" /> : <TText tKey="payout_pending" />}
                    </span>
                    <p className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      {isCompleted ? timeAgo(payout.created_at) : <TText tKey="payout_scheduled" />}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold">
                    {payout.recipient_id.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">
                      <TText tKey="payout_recipient" />: <span className="font-mono text-cyan-400">{payout.recipient_id.slice(0, 8)}...</span>
                    </p>
                  </div>
                  {payout.arbitrum_tx_hash && (
                    <a 
                      href={`https://scan.bohr.life/tx/${payout.arbitrum_tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] hover:text-cyan-400 transition-colors underline decoration-cyan-500/30"
                    >
                      TX
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {sortedPayouts.length === 0 && (
          <div className="text-center py-8 text-sm" style={{ color: 'var(--text-muted)' }}>
            <TText tKey="payout_no_scheduled" />
          </div>
        )}
      </div>
    </div>
  );
}
