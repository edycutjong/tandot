import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { formatMXN, formatMXNB, trustLabel, timeAgo, ESCROW_ADDRESS, botScanUrl } from '@/lib/constants';
import { ClientTranslation as TText } from '@/components/ui/ClientTranslation';
import type { Dictionary } from '@/lib/i18n';

import { Database } from '@/lib/supabase/database.types';
import { ContributionFlow } from '@/components/ContributionFlow';
import { PayoutTimeline } from '@/components/PayoutTimeline';
import { AIMatchPanel } from '@/components/AIMatchPanel';
import { StatCard } from '@/components/StatCard';

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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* ── Back + Header ───────────────────────────────────── */}
      <div>
        <Link
          href="/dashboard/tandas"
          className="text-sm font-medium mb-6 inline-flex items-center gap-1 hover:text-cyan-400 transition-colors"
          style={{ color: 'var(--text-muted)' }}
        >
          <TText tKey="detail_back_to_tandas" />
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 glass-card p-6 border-cyan-500/10 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-heading font-bold text-3xl tracking-tight">{tanda.name}</h1>
              <span className={`badge badge-${tanda.status} px-3 py-1 text-[10px] uppercase tracking-widest`}>
                <TText tKey={`status_${tanda.status}` as keyof Dictionary} />
              </span>
            </div>
            <p className="text-sm max-w-2xl" style={{ color: 'var(--text-secondary)' }}>
              {tanda.description || <TText tKey="hero_description" />}
            </p>
          </div>

          <div className="flex items-center gap-6 relative z-10">
            <div className="text-right hidden sm:block">
              <p className="text-xs uppercase tracking-widest font-semibold opacity-50 mb-1">
                <TText tKey="detail_ai_trust_analysis" />
              </p>
              <p className="font-heading font-bold text-xl" style={{ color: trust.color }}>{trust.text}</p>
            </div>
            <div className="trust-ring shrink-0 relative" style={{ width: 84, height: 84 }}>
              <svg width="84" height="84" viewBox="0 0 84 84" className="drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]">
                <circle cx="42" cy="42" r="36" fill="none" stroke="var(--border)" strokeWidth="4" />
                <circle
                  cx="42" cy="42" r="36" fill="none"
                  stroke={trust.color} strokeWidth="5" strokeLinecap="round"
                  strokeDasharray={`${(tanda.ai_trust_score / 100) * 226} 226`}
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono text-xl font-bold" style={{ color: trust.color }}>{tanda.ai_trust_score}</span>
                <span className="text-[8px] font-bold opacity-50 uppercase">
                  <TText tKey="detail_score" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          label={<TText tKey="detail_contribution_per_round" />} 
          value={formatMXN(tanda.contribution_amount)} 
          subValue="MXNB Stablecoin"
          icon="⚡"
          color="var(--cyan-400)"
        />
        <StatCard 
          label={<TText tKey="detail_total_pool" />} 
          value={formatMXN(poolAmount)} 
          subValue={<TText tKey="float_next_payout_value" />}
          icon="💰"
          color="var(--emerald-400)"
        />
        <StatCard 
          label={<TText tKey="detail_frequency" />} 
          value={<TText tKey={`freq_${tanda.frequency}` as keyof Dictionary} />} 
          subValue={<TText tKey="dash_on_time" />}
          icon="📅"
          color="var(--accent)"
        />
        <StatCard 
          label={<TText tKey="detail_progress" />} 
          value={`${tanda.current_round} / ${tanda.total_rounds}`} 
          subValue={`${Math.round(progress)}% Completado`}
          icon="📈"
          color="var(--cyan-500)"
        />
      </div>

      {/* ── Main Content Grid ───────────────────────────────── */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Members & AI Context (1 col) */}
        <div className="lg:col-span-1 space-y-8">
          {/* Members List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                👥 <TText tKey="detail_members" /> <span className="text-xs font-mono opacity-50">({safeMembers.length}/{tanda.max_members})</span>
              </h2>
            </div>
            <div className="space-y-3">
              {safeMembers.map((member) => {
                const memberTrust = trustLabel(member.trust_score);
                return (
                  <div key={member.id} className="glass-card p-4 flex items-center justify-between border-white/5 hover:border-cyan-500/20 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-sm font-bold border border-white/10 group-hover:from-cyan-600 group-hover:to-emerald-600 transition-all">
                          {member.display_name.charAt(0)}
                        </div>
                        {member.is_current_recipient && (
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center animate-pulse">
                            <span className="text-[8px] text-black font-bold">★</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{member.display_name}</p>
                          {member.is_current_recipient && (
                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold animate-pulse">
                              🎉 Este turno
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>
                          <TText tKey="detail_position" /> #{member.payout_position}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ background: memberTrust.color }} />
                        <p className="font-mono text-xs font-bold" style={{ color: memberTrust.color }}>
                          {member.trust_score}
                        </p>
                      </div>
                      <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                        {formatMXNB(member.total_contributed)} <TText tKey="detail_contributed" />
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Audit Panel */}
          <AIMatchPanel score={88} />
        </div>

        {/* Right Column: Interaction & Timeline (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Interaction Zone */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Contribution Flow */}
            {tanda.status === 'active' && (
              <ContributionFlow
                tandaId={tanda.id}
                amount={tanda.contribution_amount}
                round={tanda.current_round || 1}
                members={safeMembers.map((m) => ({ id: m.id, wallet_address: m.wallet_address }))}
              />
            )}

            {/* Contract Info */}
            <div className="glass-card p-6 flex flex-col justify-between border-cyan-500/10">
              <div>
                <h3 className="font-heading font-semibold text-lg mb-2 flex items-center gap-2">
                  <span className="text-emerald-400">⛓️</span>
                  <TText tKey="detail_infrastructure" />
                </h3>
                <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                  <TText tKey="detail_infrastructure_desc" />
                </p>
                
                <div className="space-y-4">
                  <div className="p-3 bg-black/40 rounded-lg border border-white/5">
                    <p className="text-[10px] uppercase font-bold opacity-50 mb-1">
                      <TText tKey="detail_contract_address" />
                    </p>
                    <p className="font-mono text-xs text-cyan-400 break-all">
                      {tanda.escrow_address || ESCROW_ADDRESS}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-medium">BOT Chain Live</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5">
                <a
                  href={botScanUrl(`address/${tanda.escrow_address || ESCROW_ADDRESS}`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full py-2 text-xs flex items-center justify-center gap-2"
                >
                  <TText tKey="detail_view_on_botscan" />
                </a>
              </div>
            </div>
          </div>

          {/* Payout Timeline */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-semibold text-xl flex items-center gap-2">
                🕒 <TText tKey="detail_payout_schedule" />
              </h2>
              <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                <TText tKey="detail_liquidator" />: <span className="text-emerald-400">Bitso API</span>
              </div>
            </div>
            <PayoutTimeline 
              payouts={safePayouts} 
              currentRound={tanda.current_round} 
            />
          </div>

          {/* Activity Logs (Mini) */}
          <div className="glass-card p-6 border-white/5">
            <h3 className="font-heading font-semibold text-sm mb-4">
              <TText tKey="detail_contribution_log" /> (<TText tKey="dash_round" /> {tanda.current_round})
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="pb-2 font-semibold"><TText tKey="dash_verify" /></th>
                    <th className="pb-2 font-semibold"><TText tKey="stat_volume" /></th>
                    <th className="pb-2 font-semibold">Fecha</th>
                    <th className="pb-2 font-semibold">Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {safeContributions
                    .filter((c) => c.round === tanda.current_round)
                    .map((contrib) => (
                      <tr key={contrib.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                            contrib.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            <TText tKey={contrib.status === 'confirmed' ? 'detail_confirmed' : 'detail_pending'} />
                          </span>
                        </td>
                        <td className="py-3 font-mono">{formatMXNB(contrib.amount)}</td>
                        <td className="py-3" style={{ color: 'var(--text-muted)' }}>{timeAgo(contrib.created_at)}</td>
                        <td className="py-3">
                          <a 
                            href={botScanUrl(`tx/${contrib.botchain_tx_hash}`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-cyan-500 hover:underline"
                          >
                            {contrib.botchain_tx_hash?.slice(0, 10)}...
                          </a>
                        </td>
                      </tr>
                    ))}
                  {safeContributions.filter((c) => c.round === tanda.current_round).length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center" style={{ color: 'var(--text-muted)' }}>
                        <TText tKey="detail_no_contributions" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

