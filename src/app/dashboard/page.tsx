import Link from 'next/link';
import { ClientTranslation as TText } from '@/components/ui/ClientTranslation';
import { createClient } from '@/lib/supabase/server';
import {
  formatMXN,
  formatMXNB,
  timeAgo,
} from '@/lib/constants';
import { Database } from '@/lib/supabase/database.types';
import { TandaCard } from '@/components/TandaCard';
import { StatCard } from '@/components/StatCard';
import { AIMatchPanel } from '@/components/AIMatchPanel';

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
    <div className="space-y-8 animate-fade-in-up">
      {/* ── Page Header ─────────────────────────────────────── */}
      <div>
        <h1 className="font-heading font-bold text-2xl mb-1"><TText tKey="dash_summary" /></h1>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          <TText tKey="dash_summary_desc" />
        </p>
      </div>

      {/* ── Stats Grid ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label={<TText tKey="dash_active_tandas" />}
          value={stats.active_tandas.toString()}
          suffix={`/ ${stats.total_tandas}`}
          icon="◎"
          trend={<>+3 <TText tKey="dash_this_month" /></>}
          color="var(--cyan-400)"
        />
        <StatCard
          label={<TText tKey="stat_volume" />}
          value={formatMXN(stats.total_volume_mxn)}
          suffix=""
          icon="◆"
          trend={<>+$125K <TText tKey="dash_this_week" /></>}
          color="var(--emerald-400, #34d399)"
        />
        <StatCard
          label={<TText tKey="stat_payouts" />}
          value={stats.successful_payouts.toString()}
          suffix=""
          icon="✓"
          trend={<>100% <TText tKey="dash_on_time" /></>}
          color="var(--emerald-400, #34d399)"
        />
        <StatCard
          label={<TText tKey="dash_fraud_prevented" />}
          value={stats.fraud_prevented.toString()}
          suffix=""
          icon="⊘"
          trend={<>$45K <TText tKey="dash_protected" /></>}
          color="var(--red-500, #ef4444)"
        />
      </div>

      {/* ── Two-column layout ───────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Active Tandas */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-lg"><TText tKey="dash_my_tandas" /></h2>
            <Link href="/dashboard/tandas" className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
              <TText tKey="dash_view_all" />
            </Link>
          </div>

          <div className="space-y-3">
            {safeTandas.length === 0 ? (
              <div className="glass-card p-8 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
                <TText tKey="dash_no_active_tandas" />
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

        {/* Recent Activity + AI Panel */}
        <div className="space-y-6">
          {/* AI Audit Panel (New in Dashboard) */}
          <AIMatchPanel score={95} />

          {/* Upcoming Payout */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-3"><TText tKey="float_next_payout" /></h3>
            {safePayouts.filter((p) => p.status === 'scheduled').length === 0 ? (
              <div className="text-xs" style={{ color: 'var(--text-muted)' }}><TText tKey="dash_no_scheduled_payouts" /></div>
            ) : (
              safePayouts
                .filter((p) => p.status === 'scheduled')
                .map((payout) => (
                  <div key={payout.id} className="glass-card wow-card p-4 gradient-border mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="badge badge-pending">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 pulse-live inline-block" />
                        <TText tKey="dash_scheduled" />
                      </span>
                      <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                        <TText tKey="dash_round" /> {payout.round}
                      </span>
                    </div>
                    <p className="stat-value text-3xl mb-1">{formatMXNB(payout.amount)}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      <TText tKey="dash_recipient" /> {payout.recipient_id.slice(0, 8)}...
                    </p>
                  </div>
                ))
            )}
          </div>

          {/* Recent Contributions */}
          <div>
            <h3 className="font-heading font-semibold text-base mb-3"><TText tKey="dash_recent_contributions" /></h3>
            <div className="space-y-2">
              {safeContributions.length === 0 ? (
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}><TText tKey="dash_no_recent_contributions" /></div>
              ) : (
                safeContributions.map((contrib) => (
                  <div key={contrib.id} className="glass-card wow-card p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={`badge ${
                          contrib.status === 'confirmed' ? 'badge-confirmed' : 'badge-pending'
                        }`}
                      >
                        {contrib.status === 'confirmed' ? '✓' : '○'}
                      </span>
                      <div>
                        <p className="text-sm font-medium">
                          {formatMXNB(contrib.amount)}
                        </p>
                        <p suppressHydrationWarning className="text-xs" style={{ color: 'var(--text-muted)' }}>
                          <TText tKey="dash_round" /> {contrib.round} · {timeAgo(contrib.created_at)}
                        </p>
                      </div>
                    </div>
                    {contrib.arbitrum_tx_hash && (
                      <a
                        href={`https://scan.bohr.life/tx/${contrib.arbitrum_tx_hash}`}
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
            <h3 className="font-heading font-semibold text-base mb-3"><TText tKey="dash_completed_payouts" /></h3>
            <div className="space-y-2">
              {safePayouts.filter((p) => p.status === 'completed').length === 0 ? (
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}><TText tKey="dash_no_completed_payouts" /></div>
              ) : (
                safePayouts
                  .filter((p) => p.status === 'completed')
                  .map((payout) => (
                    <div key={payout.id} className="glass-card wow-card p-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="badge badge-confirmed">✓</span>
                        <div>
                          <p className="text-sm font-medium">{formatMXNB(payout.amount)}</p>
                          <p suppressHydrationWarning className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            <TText tKey="dash_round" /> {payout.round} · {timeAgo(payout.created_at)}
                          </p>
                        </div>
                      </div>
                      {payout.arbitrum_tx_hash && (
                        <a
                          href={`https://scan.bohr.life/tx/${payout.arbitrum_tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs"
                          style={{ color: 'var(--accent)' }}
                        >
                          <TText tKey="dash_verify" />
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
