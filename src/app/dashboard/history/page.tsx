'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { History as HistoryIcon, ArrowUpRight, ArrowDownLeft, CheckCircle, Clock } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import { formatMXNB } from '@/lib/constants';
import { MOCK_CONTRIBUTIONS } from '@/lib/mock-data';

export default function HistoryPage() {
  const { locale } = useLocale();
  const isEs = locale === 'es';

  return (
    <div>
      <h1 className="font-heading font-bold text-3xl text-(--text-hi) mb-2">
        <HistoryIcon className="w-8 h-8 inline mr-3 text-(--cyan-400)" />
        {isEs ? 'Historial de Transacciones' : 'Transaction History'}
      </h1>
      <p className="text-(--text-mid) mb-8">
        {isEs ? 'Todas tus contribuciones y pagos registrados on-chain.' : 'All your contributions and payouts recorded on-chain.'}
      </p>

      <GlassCard className="divide-y divide-(--border-subtle)">
        {MOCK_CONTRIBUTIONS.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-(--bg-card-hover) transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                tx.status === 'confirmed'
                  ? 'bg-(--emerald-500)/10 text-(--emerald-400)'
                  : 'bg-(--amber-500)/10 text-(--amber-500)'
              }`}>
                {tx.status === 'confirmed'
                  ? <ArrowUpRight className="w-5 h-5" />
                  : <ArrowDownLeft className="w-5 h-5" />
                }
              </div>
              <div>
                <p className="text-sm font-medium text-(--text-hi)">
                  {isEs ? 'Contribución' : 'Contribution'} · {tx.tanda_id}
                </p>
                <p className="text-xs text-(--text-low) font-mono">
                  {new Date(tx.created_at).toLocaleDateString(locale === 'es' ? 'es-MX' : 'en-US')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono font-semibold text-(--text-hi)">
                {formatMXNB(tx.amount)}
              </span>
              {tx.status === 'confirmed' ? (
                <CheckCircle className="w-4 h-4 text-(--emerald-400)" />
              ) : (
                <Clock className="w-4 h-4 text-(--amber-500)" />
              )}
            </div>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
