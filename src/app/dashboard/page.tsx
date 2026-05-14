import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  formatMXN,
  formatMXNB,
  trustLabel,
  FREQUENCY_LABELS,
  STATUS_LABELS,
  timeAgo,
} from '@/lib/constants';
import { Database } from '@/lib/supabase/database.types';

type Tanda = Database['public']['Tables']['tandas']['Row'];
type Contribution = Database['public']['Tables']['contributions']['Row'];
type Payout = Database['public']['Tables']['payouts']['Row'];

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch stats concurrently
  const [
    { count: totalTandas },
    { count: activeTandas },
    { data: tandas },
    { data: recentContributions },
    { data: recentPayouts },
  ] = await Promise.all([
    supabase.from('tandas').select('*', { count: 'exact', head: true }),
    supabase.from('tandas').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('tandas').select('*').order('created_at', { ascending: false }),
    supabase.from('contributions').select('*').order('created_at', { ascending: false }).limit(5),
    supabase.from('payouts').select('*').order('created_at', { ascending: false }).limit(4),
  ]);

  // Handle potential nulls
  const safeTandas = (tandas as Tanda[]) || [];
  const safeContributions = (recentContributions as Contribution[]) || [];
  const safePayouts = (recentPayouts as Payout[]) || [];

  // Calculate some derived stats
  const totalVolumeMXN = safeTandas.reduce((acc, t) => acc + (t.contribution_amount * t.max_members * t.total_rounds), 0);
  const successfulPayouts = safePayouts.filter(p => p.status === 'completed').length;
  // Mocking fraud prevented for now since it's derived from AI logs
  const fraudPrevented = 12; 

  const stats = {
    total_tandas: totalTandas || 0,
    active_tandas: activeTandas || 0,
    total_volume_mxn: totalVolumeMXN,
    successful_payouts: successfulPayouts,
    fraud_prevented: fraudPrevented,
  };

  return (
    <div className="space-y-8">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div>
        <h1 className="font-heading font-bold text-2xl mb-1">Resumen</h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Vista general de tus tandas y actividad reciente
        </p>
      </div>

      {/* ── Stats Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Tandas Activas"
          value={stats.active_tandas.toString()}
          suffix={`/ ${stats.total_tandas}`}
          icon="🎰"
          trend="+3 este mes"
        />
        <StatCard
          label="Volumen Protegido"
          value={formatMXN(stats.total_volume_mxn)}
          suffix=""
          icon="🛡️"
          trend="+$125K esta semana"
        />
        <StatCard
          label="Pagos Exitosos"
          value={stats.successful_payouts.toString()}
          suffix=""
          icon="✅"
          trend="100% on-time"
        />
        <StatCard
          label="Fraudes Prevenidos"
          value={stats.fraud_prevented.toString()}
          suffix=""
          icon="🚫"
          trend="$45K protegidos"
        />
      </div>

      {/* ── Two-column layout ───────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Tandas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-lg">Tandas Activas</h2>
            <Link href="/dashboard/tandas" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
              Ver todas →
            </Link>
          </div>

          <div className="space-y-3">
            {safeTandas.length === 0 ? (
              <div className="glass-card p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                No hay tandas activas.
              </div>
            ) : (
              safeTandas
                .filter((t) => t.status === 'active')
                .map((tanda) => (
                  <TandaCard key={tanda.id} tanda={tanda} />
                ))
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-6">
          {/* Upcoming Payout */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-3">Próximo Pago</h3>
            {safePayouts.filter((p) => p.status === 'scheduled').length === 0 ? (
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}>No hay pagos programados.</div>
            ) : (
              safePayouts
                .filter((p) => p.status === 'scheduled')
                .map((payout) => (
                  <div key={payout.id} className="glass-card p-4 gradient-border mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge badge-pending">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-live inline-block" />
                        Programado
                      </span>
                      <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                        Ronda {payout.round}
                      </span>
                    </div>
                    <p className="stat-value text-3xl mb-1">{formatMXNB(payout.amount)}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Destinatario: {payout.recipient_id.slice(0, 8)}...
                    </p>
                  </div>
                ))
            )}
          </div>

          {/* Recent Contributions */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-3">Contribuciones Recientes</h3>
            <div className="space-y-2">
              {safeContributions.length === 0 ? (
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>No hay contribuciones recientes.</div>
              ) : (
                safeContributions.map((contrib) => (
                  <div key={contrib.id} className="glass-card p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`badge ${
                          contrib.status === 'confirmed' ? 'badge-confirmed' : 'badge-pending'
                        }`}
                      >
                        {contrib.status === 'confirmed' ? '✓' : '⏳'}
                      </span>
                      <div>
                        <p className="text-sm font-medium">
                          {formatMXNB(contrib.amount)}
                        </p>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          Ronda {contrib.round} · {timeAgo(contrib.created_at)}
                        </p>
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
                        {contrib.arbitrum_tx_hash.slice(0, 8)}…
                      </a>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Completed Payouts */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-3">Pagos Completados</h3>
            <div className="space-y-2">
              {safePayouts.filter((p) => p.status === 'completed').length === 0 ? (
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>No hay pagos completados.</div>
              ) : (
                safePayouts
                  .filter((p) => p.status === 'completed')
                  .map((payout) => (
                    <div key={payout.id} className="glass-card p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="badge badge-confirmed">✓</span>
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
                  ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stat Card Component ─────────────────────────────────────
function StatCard({
  label,
  value,
  suffix,
  icon,
  trend,
}: {
  label: string;
  value: string;
  suffix: string;
  icon: string;
  trend: string;
}) {
  return (
    <div className="glass-card p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-medium" style={{ color: 'var(--emerald-400, #34d399)' }}>
          {trend}
        </span>
      </div>
      <div className="stat-value text-2xl mb-0.5">
        {value}
        {suffix && <span className="text-sm opacity-50 ml-1">{suffix}</span>}
      </div>
      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{label}</p>
    </div>
  );
}

// ── Tanda Card Component ────────────────────────────────────
function TandaCard({ tanda }: { tanda: Tanda }) {
  const trust = trustLabel(tanda.ai_trust_score);
  const progress = tanda.total_rounds > 0
    ? (tanda.current_round / tanda.total_rounds) * 100
    : 0;

  return (
    <Link href={`/dashboard/tandas/${tanda.id}`}>
      <div className="glass-card p-5 cursor-pointer group">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-heading font-semibold text-base group-hover:text-cyan-400 transition-colors">
                {tanda.name}
              </h3>
              <span className={`badge badge-${tanda.status}`}>
                {STATUS_LABELS[tanda.status] || tanda.status}
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {tanda.description}
            </p>
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
        <div className="flex items-center gap-3 mb-2">
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
        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
          <span className="font-mono">{formatMXN(tanda.contribution_amount)}</span>
          <span>·</span>
          <span>{FREQUENCY_LABELS[tanda.frequency] || tanda.frequency}</span>
          <span>·</span>
          <span>{tanda.max_members} miembros</span>
        </div>
      </div>
    </Link>
  );
}
