'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SITE, NETWORK } from '@/lib/constants';
import { LocaleProvider, useLocale } from '@/lib/LocaleContext';
import { WalletProvider, useWallet } from '@/lib/WalletContext';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { LanguageToggle } from '@/components/ui/LanguageToggle';
import {
  LayoutDashboard,
  CircleDollarSign,
  PlusCircle,
  History,
  BrainCircuit,
  Search,
  ArrowRightLeft,
} from 'lucide-react';
import type { Locale } from '@/lib/i18n';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleRaw] = useState<Locale>('es');

  useEffect(() => {
    const saved = localStorage.getItem('tandot-locale');
    if (saved === 'es' || saved === 'en') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocaleRaw(saved);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleRaw(l);
    try { localStorage.setItem('tandot-locale', l); } catch { /* quota */ }
  }, []);

  return (
    <LocaleProvider locale={locale} setLocale={setLocale}>
      <WalletProvider>
        <DashboardShell>{children}</DashboardShell>
      </WalletProvider>
    </LocaleProvider>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const pathname = usePathname();
  const { address } = useWallet();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t.dash_summary },
    { href: '/dashboard/tandas', icon: CircleDollarSign, label: t.dash_my_tandas },
    { href: '/dashboard/create', icon: PlusCircle, label: t.dash_new_tanda },
    { href: '/dashboard/history', icon: History, label: t.dash_history },
  ];

  const toolItems = [
    { href: '/dashboard/ai', icon: BrainCircuit, label: t.dash_ai_trust },
    { href: '/dashboard/explorer', icon: Search, label: t.dash_explorer },
  ];

  return (
    <div className="min-h-dvh flex">
      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside
        className="fixed inset-y-0 left-0 w-64 border-r border-(--border) flex flex-col z-40"
        style={{ background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(16px)' }}
      >
        {/* Logo */}
        <Link href="/" className="h-16 px-5 flex items-center gap-3 border-b border-(--border) hover:opacity-80 transition-opacity">
          <Image
            src="/icon.svg"
            alt="Tandot logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="font-heading font-bold text-lg tracking-tight">{SITE.name}</span>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              active={pathname === item.href}
            />
          ))}

          <div className="pt-4 mt-4 border-t border-(--border)">
            <p className="text-xs uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--text-muted)' }}>
              {t.dash_tools}
            </p>
            {toolItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                active={pathname === item.href}
              />
            ))}
          </div>
        </nav>

        {/* Status footer */}
        <div className="p-4 border-t border-(--border)">
          <div className="glass-card p-3 flex items-center gap-3">
            <span className={`w-2 h-2 rounded-full ${address ? 'bg-emerald-400 pulse-live' : 'bg-red-500'}`} />
            <div>
              <p className="text-xs font-medium">{t.dash_network_status}</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {address ? t.dash_connected : 'Disconnected'}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────── */}
      <main className="flex-1 ml-64">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 h-16 border-b border-(--border) px-8 flex items-center justify-between"
          style={{ background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(16px)' }}
        >
          <div>
            <h2 className="font-heading font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
              {t.dash_tagline}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            
            <a
              href={NETWORK === 'mainnet' ? 'https://testnet.tandot.edycu.dev' : 'https://mainnet.tandot.edycu.dev'}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border border-(--border) bg-(--bg-card-hover) hover:bg-(--border) transition-colors"
            >
              <ArrowRightLeft className="w-3 h-3" />
              {NETWORK === 'mainnet' ? 'Testnet' : 'Mainnet'}
            </a>

            <div className="badge badge-active">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-live inline-block" />
              Demo Mode
            </div>
            
            <ConnectButton showBalance={false} />
          </div>
        </header>

        {/* Page content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-(--cyan-500)/10 text-(--cyan-400) border border-(--cyan-500)/20'
          : 'hover:bg-(--bg-card-hover) text-(--text-mid)'
      }`}
    >
      <Icon className={`w-[18px] h-[18px] ${active ? 'text-(--cyan-400)' : ''}`} />
      {label}
    </Link>
  );
}
