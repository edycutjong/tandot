'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { TrustRing } from '@/components/ui/TrustRing';
import { BrainCircuit, ShieldCheck, AlertTriangle, TrendingUp } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import { MOCK_MEMBERS } from '@/lib/mock-data';

export default function AITrustPage() {
  const { locale } = useLocale();
  const isEs = locale === 'es';

  const sortedMembers = [...MOCK_MEMBERS].sort((a, b) => b.trust_score - a.trust_score);

  return (
    <div>
      <h1 className="font-heading font-bold text-3xl text-(--text-hi) mb-2">
        <BrainCircuit className="w-8 h-8 inline mr-3 text-(--cyan-400)" />
        {isEs ? 'IA Trust Score' : 'AI Trust Score'}
      </h1>
      <p className="text-(--text-mid) mb-8">
        {isEs
          ? 'GPT-4 evalúa la confiabilidad de cada miembro usando 5 factores.'
          : 'GPT-4 evaluates each member\'s reliability using 5 factors.'}
      </p>

      {/* Factor Legend */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { icon: TrendingUp, label: isEs ? 'Historial de Pagos' : 'Payment History', weight: '35%' },
          { icon: ShieldCheck, label: isEs ? 'Tasa Puntual' : 'On-Time Rate', weight: '25%' },
          { icon: BrainCircuit, label: isEs ? 'Diversidad Grupal' : 'Group Diversity', weight: '15%' },
          { icon: AlertTriangle, label: isEs ? 'Antigüedad' : 'Account Age', weight: '15%' },
          { icon: TrendingUp, label: isEs ? 'Referidos' : 'Referral Quality', weight: '10%' },
        ].map((factor) => (
          <GlassCard key={factor.label} className="p-4 text-center">
            <factor.icon className="w-5 h-5 mx-auto mb-2 text-(--cyan-400)" />
            <p className="text-xs font-medium text-(--text-hi)">{factor.label}</p>
            <p className="text-xs font-mono text-(--text-low)">{factor.weight}</p>
          </GlassCard>
        ))}
      </div>

      {/* Member Scores */}
      <GlassCard className="divide-y divide-(--border-subtle)">
        {sortedMembers.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4 hover:bg-(--bg-card-hover) transition-colors">
            <div className="flex items-center gap-4">
              <TrustRing score={member.trust_score} size={44} strokeWidth={4} />
              <div>
                <p className="text-sm font-medium text-(--text-hi)">{member.display_name}</p>
                <p className="text-xs text-(--text-low) font-mono">
                  {member.wallet_address.slice(0, 8)}…{member.wallet_address.slice(-4)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-mono font-bold text-lg ${
                member.trust_score >= 80 ? 'text-(--emerald-400)'
                  : member.trust_score >= 60 ? 'text-(--amber-500)'
                  : 'text-(--red-500)'
              }`}>
                {member.trust_score}
              </span>
              <span className="text-xs text-(--text-low)">/100</span>
            </div>
          </div>
        ))}
      </GlassCard>
    </div>
  );
}
