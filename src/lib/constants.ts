// ============================================================
// Tandot — Design tokens and constants
// ============================================================

export const SITE = {
  name: 'Tandot',
  tagline: 'Tandas sin confianza ciega',
  taglineEn: 'Trustless Rotating Savings',
  description:
    'AI-managed, fraud-proof rotating savings circles (tandas) on MXNB — the Mexican peso stablecoin on BOT Chain.',
  url: 'https://tandot.vercel.app',
} as const;

// ============================================================
// BOT Chain — network config (verified live via eth_chainId)
// Demo runs on the "bohr" testnet: chain 968, rpc.bohr.life,
// scan.bohr.life — where TandaEscrow/MockMXNB are deployed.
// (Mainnet is chain 677 / rpc.botchain.ai, not used for the demo.)
// ============================================================
export const BOT_CHAIN_ID = 968;

export const BOT_CHAIN = {
  id: BOT_CHAIN_ID,
  name: 'BOT Chain Testnet',
  nativeCurrency: { name: 'BOT', symbol: 'BOT', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.bohr.life'] },
  },
  blockExplorers: {
    default: { name: 'BOTScan', url: 'https://scan.bohr.life' },
  },
} as const;

/** Build a BOTScan address/tx URL */
export function botScanUrl(path: `address/${string}` | `tx/${string}`): string {
  return `${BOT_CHAIN.blockExplorers.default.url}/${path}`;
}

// ── Deployed contracts (chain 968) ──────────────────────────
export const ESCROW_ADDRESS = (process.env.NEXT_PUBLIC_ESCROW_CONTRACT_ADDRESS ||
  '0x9c400171c76F1eaE1D64aD98E1a0bFB8B871BbdE') as `0x${string}`;

export const MXNB_ADDRESS = (process.env.NEXT_PUBLIC_MXNB_TOKEN_ADDRESS ||
  '0x5416728FD22b18880d55A8920617A424a6dab1dF') as `0x${string}`;

/** MockMXNB uses the default ERC-20 precision. */
export const MXNB_DECIMALS = 18;

/**
 * Map a tanda's DB UUID to the uint256 `tandaId` used on-chain for per-tanda
 * accounting. Strips hyphens and parses the 128-bit UUID directly to a BigInt
 * to guarantee zero collisions on-chain.
 */
export function toOnchainTandaId(uuid: string): bigint {
  // Strip hyphens and parse as hex. A UUID is 128 bits, which fits safely in a bigint/uint256.
  return BigInt('0x' + uuid.replace(/-/g, ''));
}

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
