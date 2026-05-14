import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatMXN, formatMXNB, trustLabel, FREQUENCY_LABELS, STATUS_LABELS, timeAgo } from '@/lib/constants';

import { Database } from '@/lib/supabase/database.types';

type Tanda = Database['public']['Tables']['tandas']['Row'];
type TandaMember = Database['public']['Tables']['tanda_members']['Row'];
type Contribution = Database['public']['Tables']['contributions']['Row'];
type Payout = Database['public']['Tables']['payouts']['Row'];

export default async function TandaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch tanda
  const { data: tandaData } = await supabase.from('tandas').select('*').eq('id', id).single();
  const tanda = tandaData as Tanda | null;

  if (!tanda) {
    notFound();
  }

  // Fetch related data in parallel
  const [
    { data: members },
    { data: contributions },
    { data: payouts }
  ] = await Promise.all([
    supabase.from('tanda_members').select('*').eq('tanda_id', id).order('payout_position', { ascending: true }),
    supabase.from('contributions').select('*').eq('tanda_id', id).order('created_at', { ascending: false }),
    supabase.from('payouts').select('*').eq('tanda_id', id).order('created_at', { ascending: false })
  ]);

  const safeMembers = (members as TandaMember[]) || [];
  const safeContributions = (contributions as Contribution[]) || [];
  const safePayouts = (payouts as Payout[]) || [];

  const trust = trustLabel(tanda.ai_trust_score);
  const progress = tanda.total_rounds > 0 ? (tanda.current_round / tanda.total_rounds) * 100 : 0;
  const poolAmount = tanda.contribution_amount * tanda.max_members;

  return (
    <div className="space-y-8">
      {/* ── Back + Header ───────────────────────────────────── */}
      <div>
        <Link
          href="/dashboard/tandas"
          className="text-sm font-medium mb-4 inline-flex items-center gap-1"
          style={{ color: 'var(--text-muted)' }}
        >
          ← Volver a Mis Tandas
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-heading font-bold text-2xl">{tanda.name}</h1>
              <span className={`badge badge-${tanda.status}`}>{STATUS_LABELS[tanda.status] || tanda.status}</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{tanda.description}</p>
          </div>
          <div className="trust-ring shrink-0" style={{ width: 72, height: 72 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="30" fill="none" stroke="var(--border)" strokeWidth="4" />
              <circle
                cx="36" cy="36" r="30" fill="none"
                stroke={trust.color} strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${(tanda.ai_trust_score / 100) * 188.5} 188.5`}
                style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
            </svg>
            <span className="score text-lg" style={{ color: trust.color }}>{tanda.ai_trust_score}</span>
          </div>
        </div>
      </div>

      {/* ── Stats Row ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MiniStat label="Cuota" value={formatMXN(tanda.contribution_amount)} />
        <MiniStat label="Pozo por ronda" value={formatMXN(poolAmount)} />
        <MiniStat label="Frecuencia" value={FREQUENCY_LABELS[tanda.frequency] || tanda.frequency} />
        <MiniStat label="Progreso" value={`${tanda.current_round} / ${tanda.total_rounds}`} />
        <MiniStat label="Trust Score" value={`${tanda.ai_trust_score} — ${trust.text}`} />
      </div>

      {/* ── Progress Bar ────────────────────────────────────── */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">Progreso de la Tanda</span>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            Ronda {tanda.current_round} de {tanda.total_rounds}
          </span>
        </div>
        <div className="h-3 rounded-full" style={{ background: 'var(--border)' }}>
          <div
            className="h-full rounded-full progress-animated"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--cyan-500), var(--emerald-500))',
            }}
          />
        </div>
        {/* Round indicators */}
        <div className="flex justify-between mt-2">
          {Array.from({ length: tanda.total_rounds }, (_, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-full border-2"
              style={{
                borderColor: i < tanda.current_round ? 'var(--emerald-500)' : 'var(--border)',
                background: i < tanda.current_round ? 'var(--emerald-500)' : 'transparent',
              }}
              title={`Ronda ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Two-column: Members + Activity ──────────────────── */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Members */}
        <div>
          <h2 className="font-heading font-semibold text-lg mb-4">
            Miembros ({safeMembers.length}/{tanda.max_members})
          </h2>
          <div className="space-y-2">
            {safeMembers.map((member) => {
              const memberTrust = trustLabel(member.trust_score);
              return (
                <div key={member.id} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-emerald-600 flex items-center justify-center text-white text-sm font-bold">
                      {member.display_name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{member.display_name}</p>
                        {member.is_current_recipient && (
                          <span className="badge badge-active text-[10px] py-0.5 px-2">
                            🎉 Este turno
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                        Posición #{member.payout_position} · {member.wallet_address.slice(0, 10)}…
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-medium" style={{ color: memberTrust.color }}>
                      {member.trust_score}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {formatMXNB(member.total_contributed)} aportado
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          {/* Contributions */}
          <div>
            <h2 className="font-heading font-semibold text-lg mb-4">Contribuciones Ronda {tanda.current_round}</h2>
            <div className="space-y-2">
              {safeContributions
                .filter((c) => c.round === tanda.current_round)
                .map((contrib) => (
                  <div key={contrib.id} className="glass-card p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`badge ${contrib.status === 'confirmed' ? 'badge-confirmed' : 'badge-pending'}`}>
                        {contrib.status === 'confirmed' ? '✓' : '⏳'}
                      </span>
                      <div>
                        <p className="text-sm font-medium">{formatMXNB(contrib.amount)}</p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{timeAgo(contrib.created_at)}</p>
                      </div>
                    </div>
                    {contrib.arbitrum_tx_hash && (
                      <a
                        href={`https://arbiscan.io/tx/${contrib.arbitrum_tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-xs"
                        style={{ color: 'var(--accent)' }}
                      >
                        Arbiscan ↗
                      </a>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Payout History */}
          <div>
            <h2 className="font-heading font-semibold text-lg mb-4">Historial de Pagos</h2>
            <div className="space-y-2">
              {safePayouts.map((payout) => (
                <div key={payout.id} className="glass-card p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className={`badge ${payout.status === 'completed' ? 'badge-confirmed' : 'badge-pending'}`}>
                      {payout.status === 'completed' ? '✓' : '⏳'}
                    </span>
                    <div>
                      <p className="text-sm font-medium">{formatMXNB(payout.amount)}</p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Ronda {payout.round} · {timeAgo(payout.created_at)}
                      </p>
                    </div>
                  </div>
                  {payout.arbitrum_tx_hash && (
                    <a
                      href={`https://arbiscan.io/tx/${payout.arbitrum_tx_hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs"
                      style={{ color: 'var(--accent)' }}
                    >
                      Verificar ↗
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Escrow Contract */}
          {tanda.escrow_address && (
            <div className="glass-card p-4 gradient-border">
              <h3 className="font-heading font-semibold text-sm mb-2">Contrato Escrow</h3>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs" style={{ color: 'var(--accent)' }}>
                  {tanda.escrow_address}
                </span>
              </div>
              <a
                href={`https://arbiscan.io/address/${tanda.escrow_address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs mt-2 inline-block"
                style={{ color: 'var(--accent)' }}
              >
                Ver en Arbiscan ↗
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass-card p-4">
      <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <p className="font-mono text-sm font-semibold">{value}</p>
    </div>
  );
}

