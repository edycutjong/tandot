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
// BOT Chain — network registry (verified live via eth_chainId)
// Switch with NEXT_PUBLIC_NETWORK=testnet|mainnet (defaults to
// testnet). Chain id, RPC, explorer, and the deployed contract
// addresses all move together as one unit, so the active chain
// can never drift out of sync with the contracts it points at.
// ============================================================
export type BotNetwork = 'testnet' | 'mainnet';

const NETWORKS = {
  // "bohr" testnet — chain 968, where the demo contracts are deployed.
  testnet: {
    id: 968,
    name: 'BOT Chain Testnet',
    rpcUrl: 'https://rpc.bohr.life',
    explorerUrl: 'https://scan.bohr.life',
    escrow: '0x15eF821fEc9eEFd20f30e443A5a8239873EDe80e',
    mxnb: '0xC57D472C2CD8fbE83B2B9FABd9c167A0C2c6DCEa',
  },
  // BOT Chain mainnet — chain 677.
  mainnet: {
    id: 677,
    name: 'BOT Chain',
    rpcUrl: 'https://rpc.botchain.ai',
    explorerUrl: 'https://scan.botchain.ai',
    escrow: '0x8413eCc78A8110D0EA05F346c9c2C7d0886B352c',
    mxnb: '0x0B551C18aAF6b1c1c12c026e7ABd2CFAd511BFe7',
  },
} as const satisfies Record<
  BotNetwork,
  {
    id: number;
    name: string;
    rpcUrl: string;
    explorerUrl: string;
    escrow: `0x${string}`;
    mxnb: `0x${string}`;
  }
>;

/** Active network, selected at build/runtime via NEXT_PUBLIC_NETWORK. */
export const NETWORK: BotNetwork =
  process.env.NEXT_PUBLIC_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';

const ACTIVE = NETWORKS[NETWORK];

export const BOT_CHAIN_ID = ACTIVE.id;

export const BOT_CHAIN = {
  id: ACTIVE.id,
  name: ACTIVE.name,
  nativeCurrency: { name: 'BOT', symbol: 'BOT', decimals: 18 },
  rpcUrls: {
    default: { http: [ACTIVE.rpcUrl] },
  },
  blockExplorers: {
    default: { name: 'BOTScan', url: ACTIVE.explorerUrl },
  },
} as const;

/** Build a BOTScan address/tx URL */
export function botScanUrl(path: `address/${string}` | `tx/${string}`): string {
  return `${BOT_CHAIN.blockExplorers.default.url}/${path}`;
}

// ── Deployed contracts (move with the active network) ──────────
export const ESCROW_ADDRESS = ACTIVE.escrow as `0x${string}`;
export const MXNB_ADDRESS = ACTIVE.mxnb as `0x${string}`;

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
