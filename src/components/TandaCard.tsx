'use client';

import Link from 'next/link';
import { formatMXN, trustLabel } from '@/lib/constants';
import { ClientTranslation as TText } from '@/components/ui/ClientTranslation';
import type { Dictionary } from '@/lib/i18n';
import { Database } from '@/lib/supabase/database.types';

type Tanda = Database['public']['Tables']['tandas']['Row'];

interface TandaCardProps {
  tanda: Tanda;
  showDescription?: boolean;
  showEscrow?: boolean;
}

export function TandaCard({ 
  tanda, 
  showDescription = false,
  showEscrow = false
}: TandaCardProps) {
  const trust = trustLabel(tanda.ai_trust_score);
  const progress = tanda.total_rounds > 0
    ? (tanda.current_round / tanda.total_rounds) * 100
    : 0;

  return (
    <Link href={`/dashboard/tandas/${tanda.id}`}>
      <div className="glass-card wow-card p-5 cursor-pointer group h-full">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-heading font-semibold text-base group-hover:text-cyan-400 transition-colors">
                {tanda.name}
              </h3>
              <span className={`badge badge-${tanda.status}`}>
                <TText tKey={`status_${tanda.status}` as keyof Dictionary} />
              </span>
            </div>
            {showDescription && tanda.description && (
              <p className="text-xs mb-2 line-clamp-2" style={{ color: 'var(--text-muted)' }}>
                {tanda.description}
              </p>
            )}
            {!showDescription && (
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {tanda.description}
              </p>
            )}
          </div>

          {/* Trust Score Ring */}
          <div className="trust-ring shrink-0 ml-4">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle
                cx="28" cy="28" r="24"
                fill="none"
                stroke="var(--border)"
                strokeWidth="3"
              />
              <circle
                cx="28" cy="28" r="24"
                fill="none"
                stroke={trust.color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${(tanda.ai_trust_score / 100) * 150.8} 150.8`}
              />
            </svg>
            <span className="score" style={{ color: trust.color }}>
              {tanda.ai_trust_score}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--border)' }}>
            <div
              className="h-full rounded-full progress-animated"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, var(--cyan-500), var(--emerald-500))`,
              }}
            />
          </div>
          <span className="font-mono text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>
            {tanda.current_round}/{tanda.total_rounds}
          </span>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: 'var(--text-muted)' }}>
          <span className="font-mono">{formatMXN(tanda.contribution_amount)}</span>
          <span>·</span>
          <span><TText tKey={`freq_${tanda.frequency}` as keyof Dictionary} /></span>
          <span>·</span>
          <span>{tanda.max_members} <TText tKey="dash_members" /></span>
          {showEscrow && tanda.escrow_address && (
            <>
              <span>·</span>
              <span className="font-mono">
                {tanda.escrow_address.slice(0, 6)}…{tanda.escrow_address.slice(-4)}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
