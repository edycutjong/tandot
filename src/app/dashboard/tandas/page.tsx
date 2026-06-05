import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatMXN, trustLabel, ESCROW_ADDRESS } from '@/lib/constants';
import { ClientTranslation as TText } from '@/components/ui/ClientTranslation';
import type { Dictionary } from '@/lib/i18n';

import { Database } from '@/lib/supabase/database.types';

type Tanda = Database['public']['Tables']['tandas']['Row'];

export default async function TandasPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter = 'all' } = await searchParams;
  const supabase = await createClient();

  // Scope to this network's tandas (escrow address is the network discriminator
  // on the shared DB).
  const query = supabase
    .from('tandas')
    .select('*')
    .eq('escrow_address', ESCROW_ADDRESS)
    .order('created_at', { ascending: false });
  const finalQuery = filter !== 'all' ? query.eq('status', filter as Tanda['status']) : query;

  const { data: tandas } = await finalQuery;
  const safeTandas = (tandas as Tanda[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl mb-1"><TText tKey="dash_my_tandas" /></h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            <TText tKey="dash_my_tandas_desc" />
          </p>
        </div>
        <Link href="/dashboard/create" className="btn-primary">
          <TText tKey="dash_new_tanda_btn" />
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {['all', 'active', 'forming', 'completed'].map((f) => (
          <Link
            key={f}
            href={`/dashboard/tandas${f === 'all' ? '' : `?filter=${f}`}`}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            {f === 'all' ? <TText tKey="dash_all" /> : <TText tKey={`status_${f}` as keyof Dictionary} />}
          </Link>
        ))}
      </div>

      {/* Tanda Grid */}
      {safeTandas.length === 0 ? (
        <div className="glass-card p-12 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
          <TText tKey="dash_no_tandas_filter" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {safeTandas.map((tanda) => {
            const trust = trustLabel(tanda.ai_trust_score);
            const progress = tanda.total_rounds > 0
              ? (tanda.current_round / tanda.total_rounds) * 100
              : 0;

            return (
              <Link key={tanda.id} href={`/dashboard/tandas/${tanda.id}`}>
                <div className="glass-card p-6 cursor-pointer group h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-heading font-semibold text-lg group-hover:text-cyan-400 transition-colors">
                          {tanda.name}
                        </h3>
                      </div>
                      <span className={`badge badge-${tanda.status}`}>
                        <TText tKey={`status_${tanda.status}` as keyof Dictionary} />
                      </span>
                    </div>

                    {tanda.ai_trust_score > 0 && (
                      <div className="trust-ring shrink-0">
                        <svg width="56" height="56" viewBox="0 0 56 56">
                          <circle cx="28" cy="28" r="24" fill="none" stroke="var(--border)" strokeWidth="3" />
                          <circle
                            cx="28" cy="28" r="24" fill="none"
                            stroke={trust.color} strokeWidth="3" strokeLinecap="round"
                            strokeDasharray={`${(tanda.ai_trust_score / 100) * 150.8} 150.8`}
                          />
                        </svg>
                        <span className="score" style={{ color: trust.color }}>
                          {tanda.ai_trust_score}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm mb-4 leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
                    {tanda.description}
                  </p>

                  {/* Progress */}
                  {tanda.status === 'active' && (
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-2 rounded-full" style={{ background: 'var(--border)' }}>
                        <div
                          className="h-full rounded-full progress-animated"
                          style={{
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, var(--cyan-500), var(--emerald-500))',
                          }}
                        />
                      </div>
                      <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
                        {tanda.current_round}/{tanda.total_rounds}
                      </span>
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs flex-wrap" style={{ color: 'var(--text-muted)' }}>
                    <span className="font-mono font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {formatMXN(tanda.contribution_amount)}
                    </span>
                    <span>·</span>
                    <span><TText tKey={`freq_${tanda.frequency}` as keyof Dictionary} /></span>
                    <span>·</span>
                    <span>{tanda.max_members} <TText tKey="dash_members" /></span>
                    {tanda.escrow_address && (
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
          })}
        </div>
      )}
    </div>
  );
}
