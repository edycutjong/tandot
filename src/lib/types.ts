// ============================================================
// Tandot — Core type definitions
// ============================================================

/** Status of a tanda lifecycle */
export type TandaStatus = 'forming' | 'active' | 'completed' | 'disputed';

/** Frequency of contributions */
export type ContributionFrequency = 'weekly' | 'biweekly' | 'monthly';

/** A rotating savings circle */
export interface Tanda {
  id: string;
  name: string;
  description: string;
  contribution_amount: number; // in MXN
  frequency: ContributionFrequency;
  max_members: number;
  current_round: number;
  total_rounds: number;
  status: TandaStatus;
  escrow_address: string | null; // Arbitrum contract address
  ai_trust_score: number; // 0-100
  created_at: string;
  next_payout_at: string | null;
}

/** A member in a tanda */
export interface TandaMember {
  id: string;
  tanda_id: string;
  wallet_address: string;
  display_name: string;
  avatar_url: string | null;
  trust_score: number; // 0-100, AI-computed
  payout_position: number; // 1-indexed, which round they receive
  is_current_recipient: boolean;
  total_contributed: number;
  total_received: number;
  joined_at: string;
}

/** A single contribution (payment into the pool) */
export interface Contribution {
  id: string;
  tanda_id: string;
  member_id: string;
  round: number;
  amount: number;
  currency: 'MXNB' | 'MXN';
  status: 'pending' | 'confirmed' | 'failed';
  bitso_tx_id: string | null;
  arbitrum_tx_hash: string | null;
  created_at: string;
  confirmed_at: string | null;
}

/** A payout to the round winner */
export interface Payout {
  id: string;
  tanda_id: string;
  recipient_id: string;
  round: number;
  amount: number;
  currency: 'MXNB' | 'MXN';
  status: 'scheduled' | 'processing' | 'completed' | 'failed';
  bitso_payout_id: string | null;
  arbitrum_tx_hash: string | null;
  created_at: string;
  completed_at: string | null;
}

/** AI trust scoring result */
export interface TrustScore {
  member_id: string;
  score: number; // 0-100
  factors: {
    payment_history: number;
    on_time_rate: number;
    group_diversity: number;
    account_age: number;
    referral_quality: number;
  };
  recommendation: string;
  computed_at: string;
}

/** Bitso webhook event */
export interface BitsoWebhookEvent {
  id: string;
  event_type: 'deposit' | 'withdrawal' | 'transfer';
  status: 'pending' | 'complete' | 'failed';
  amount: string;
  currency: string;
  tx_id: string;
  timestamp: string;
}

/** Dashboard summary stats */
export interface DashboardStats {
  total_tandas: number;
  active_tandas: number;
  total_volume_mxn: number;
  total_members: number;
  avg_trust_score: number;
  successful_payouts: number;
  fraud_prevented: number;
}
