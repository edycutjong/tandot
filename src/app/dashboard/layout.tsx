import Link from 'next/link';
import { SITE } from '@/lib/constants';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh flex">
      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside
        className="fixed inset-y-0 left-0 w-64 border-r border-[var(--border)] flex flex-col z-40"
        style={{ background: 'rgba(2, 6, 23, 0.95)', backdropFilter: 'blur(16px)' }}
      >
        {/* Logo */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-[var(--border)]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white font-bold text-sm font-heading">
            T
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">{SITE.name}</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <NavItem href="/dashboard" icon="📊" label="Resumen" />
          <NavItem href="/dashboard/tandas" icon="🎰" label="Mis Tandas" />
          <NavItem href="/dashboard/create" icon="➕" label="Nueva Tanda" />
          <NavItem href="/dashboard/history" icon="📜" label="Historial" />

          <div className="pt-4 mt-4 border-t border-[var(--border)]">
            <p className="text-xs uppercase tracking-widest px-3 mb-2" style={{ color: 'var(--text-muted)' }}>
              Herramientas
            </p>
            <NavItem href="/dashboard/ai" icon="🤖" label="IA Trust Score" />
            <NavItem href="/dashboard/explorer" icon="🔍" label="Explorador" />
          </div>
        </nav>

        {/* Status footer */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="glass-card p-3 flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-live" />
            <div>
              <p className="text-xs font-medium">Arbitrum Mainnet</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>MXNB · Conectado</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ───────────────────────────────────── */}
      <main className="flex-1 ml-64">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 h-16 border-b border-[var(--border)] px-8 flex items-center justify-between"
          style={{ background: 'rgba(2, 6, 23, 0.8)', backdropFilter: 'blur(16px)' }}
        >
          <div>
            <h2 className="font-heading font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
              {SITE.tagline}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="badge badge-active">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-live inline-block" />
              Demo Mode
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600 to-emerald-600 flex items-center justify-center text-white text-xs font-bold">
              E
            </div>
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

function NavItem({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-[var(--bg-card-hover)]"
      style={{ color: 'var(--text-secondary)' }}
    >
      <span className="text-base">{icon}</span>
      {label}
    </Link>
  );
}
