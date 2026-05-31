'use client';

import { GlassCard } from '@/components/ui/GlassCard';
import { Search, ExternalLink, ShieldCheck, Clock } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import { useState } from 'react';

const ESCROW_ADDRESS = process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS || '0x8413eCc78A8110D0EA05F346c9c2C7d0886B352c';
const MXNB_ADDRESS = process.env.NEXT_PUBLIC_MXNB_TOKEN_ADDRESS || '0x0B551C18aAF6b1c1c12c026e7ABd2CFAd511BFe7';

export default function ExplorerPage() {
  const { locale } = useLocale();
  const isEs = locale === 'es';
  const [searchQuery, setSearchQuery] = useState('');

  const contracts = [
    {
      name: 'TandaEscrow',
      address: ESCROW_ADDRESS,
      status: isEs ? 'Verificado' : 'Verified',
      deployedAt: '2026-05-13',
    },
    {
      name: 'MockMXNB Token',
      address: MXNB_ADDRESS,
      status: isEs ? 'Verificado' : 'Verified',
      deployedAt: '2026-05-13',
    },
  ];

  return (
    <div>
      <h1 className="font-heading font-bold text-3xl text-(--text-hi) mb-2">
        <Search className="w-8 h-8 inline mr-3 text-(--cyan-400)" />
        {isEs ? 'Explorador On-Chain' : 'On-Chain Explorer'}
      </h1>
      <p className="text-(--text-mid) mb-8">
        {isEs ? 'Verifica contratos y transacciones directamente en Arbiscan.' : 'Verify contracts and transactions directly on Arbiscan.'}
      </p>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-(--text-low)" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isEs ? 'Buscar dirección, tx hash…' : 'Search address, tx hash…'}
          className="w-full pl-12 pr-4 py-3 rounded-lg bg-(--bg-base) border border-(--border) text-(--text-hi) placeholder:text-(--text-low) focus:border-(--cyan-500) focus:outline-none transition-colors font-mono text-sm"
        />
      </div>

      {/* Deployed Contracts */}
      <h2 className="font-heading font-semibold text-lg text-(--text-hi) mb-4">
        {isEs ? 'Contratos Desplegados' : 'Deployed Contracts'}
      </h2>
      <div className="space-y-4">
        {contracts.map((contract) => (
          <GlassCard key={contract.name} className="p-5 flex items-center justify-between hover:border-(--cyan-500)/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-(--emerald-500)/10 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-(--emerald-400)" />
              </div>
              <div>
                <p className="text-sm font-semibold text-(--text-hi)">{contract.name}</p>
                <p className="text-xs font-mono text-(--text-low)">
                  {contract.address.slice(0, 10)}…{contract.address.slice(-8)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-(--text-low)" />
                  <span className="text-xs text-(--text-low)">{contract.deployedAt}</span>
                </div>
              </div>
            </div>
            <a
              href={`https://scan.bohr.life/address/${contract.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary text-xs flex items-center gap-1.5"
            >
              Arbiscan <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
