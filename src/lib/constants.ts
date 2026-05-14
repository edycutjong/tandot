// ============================================================
// Tandot — Design tokens and constants
// ============================================================

export const SITE = {
  name: 'Tandot',
  tagline: 'Tandas sin confianza ciega',
  taglineEn: 'Trustless Rotating Savings',
  description:
    'AI-managed, fraud-proof rotating savings circles (tandas) on MXNB — the Mexican peso stablecoin on Arbitrum.',
  url: 'https://tandot.vercel.app',
} as const;

/** Design system color tokens */
export const COLORS = {
  // Primary — MXNB / Bitso brand
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  // Success — Payouts, confirmed transactions
  emerald: {
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
  },
  // Warning — Pending, attention needed
  amber: {
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
  },
  // Danger — Alerts, fraud, missed payments
  red: {
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
  },
  // Neutrals — Backgrounds, text
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
} as const;

/** Currency formatting */
export function formatMXN(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatMXNB(amount: number): string {
  return `${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXNB`;
}

/** Relative time formatting */
export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'hace un momento';
  if (seconds < 3600) return `hace ${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `hace ${Math.floor(seconds / 3600)}h`;
  return `hace ${Math.floor(seconds / 86400)}d`;
}

/** Trust score label */
export function trustLabel(score: number): { text: string; color: string } {
  if (score >= 80) return { text: 'Excelente', color: COLORS.emerald[500] };
  if (score >= 60) return { text: 'Bueno', color: COLORS.cyan[500] };
  if (score >= 40) return { text: 'Regular', color: COLORS.amber[500] };
  return { text: 'Riesgoso', color: COLORS.red[500] };
}

/** Contribution frequency labels (Spanish) */
export const FREQUENCY_LABELS: Record<string, string> = {
  weekly: 'Semanal',
  biweekly: 'Quincenal',
  monthly: 'Mensual',
};

/** Tanda status labels (Spanish) */
export const STATUS_LABELS: Record<string, string> = {
  forming: 'Formándose',
  active: 'Activa',
  completed: 'Completada',
  disputed: 'En disputa',
};
