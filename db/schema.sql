-- ============================================================
-- Tandot — Supabase Database Schema
-- AI-managed rotating savings circles (tandas) on MXNB
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Tandas Table ────────────────────────────────────────────
CREATE TABLE tandas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  contribution_amount NUMERIC(12,2) NOT NULL CHECK (contribution_amount > 0),
  frequency TEXT NOT NULL CHECK (frequency IN ('weekly', 'biweekly', 'monthly')),
  max_members INT NOT NULL CHECK (max_members >= 2 AND max_members <= 50),
  current_round INT NOT NULL DEFAULT 0,
  total_rounds INT NOT NULL CHECK (total_rounds >= 1),
  status TEXT NOT NULL DEFAULT 'forming' CHECK (status IN ('forming', 'active', 'completed', 'disputed')),
  escrow_address TEXT, -- Arbitrum contract address
  ai_trust_score NUMERIC(5,2) DEFAULT 0,
  creator_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_payout_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── Members Table ───────────────────────────────────────────
CREATE TABLE tanda_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tanda_id UUID NOT NULL REFERENCES tandas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  wallet_address TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  trust_score NUMERIC(5,2) DEFAULT 0,
  payout_position INT NOT NULL,
  is_current_recipient BOOLEAN DEFAULT FALSE,
  total_contributed NUMERIC(12,2) DEFAULT 0,
  total_received NUMERIC(12,2) DEFAULT 0,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tanda_id, payout_position),
  UNIQUE(tanda_id, wallet_address)
);

-- ── Contributions Table ─────────────────────────────────────
CREATE TABLE contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tanda_id UUID NOT NULL REFERENCES tandas(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES tanda_members(id) ON DELETE CASCADE,
  round INT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'MXNB' CHECK (currency IN ('MXNB', 'MXN')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  bitso_tx_id TEXT,
  arbitrum_tx_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  UNIQUE(tanda_id, member_id, round)
);

-- ── Payouts Table ───────────────────────────────────────────
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tanda_id UUID NOT NULL REFERENCES tandas(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES tanda_members(id) ON DELETE CASCADE,
  round INT NOT NULL,
  amount NUMERIC(12,2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL DEFAULT 'MXNB' CHECK (currency IN ('MXNB', 'MXN')),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'processing', 'completed', 'failed')),
  bitso_payout_id TEXT,
  arbitrum_tx_hash TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  UNIQUE(tanda_id, round)
);

-- ── Webhook Events Table (Bitso) ────────────────────────────
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ─────────────────────────────────────────────────
CREATE INDEX idx_tandas_status ON tandas(status);
CREATE INDEX idx_tandas_creator ON tandas(creator_id);
CREATE INDEX idx_members_tanda ON tanda_members(tanda_id);
CREATE INDEX idx_members_user ON tanda_members(user_id);
CREATE INDEX idx_contributions_tanda ON contributions(tanda_id);
CREATE INDEX idx_contributions_member ON contributions(member_id);
CREATE INDEX idx_contributions_status ON contributions(status);
CREATE INDEX idx_payouts_tanda ON payouts(tanda_id);
CREATE INDEX idx_payouts_recipient ON payouts(recipient_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);

-- ── Row Level Security ──────────────────────────────────────
ALTER TABLE tandas ENABLE ROW LEVEL SECURITY;
ALTER TABLE tanda_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Public read access for tandas and members (for demo)
CREATE POLICY "tandas_read_all" ON tandas FOR SELECT USING (true);
CREATE POLICY "members_read_all" ON tanda_members FOR SELECT USING (true);
CREATE POLICY "contributions_read_all" ON contributions FOR SELECT USING (true);
CREATE POLICY "payouts_read_all" ON payouts FOR SELECT USING (true);

-- Authenticated write access
CREATE POLICY "tandas_insert_auth" ON tandas FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "members_insert_auth" ON tanda_members FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "contributions_insert_auth" ON contributions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Service role for webhook processing
CREATE POLICY "webhook_service_insert" ON webhook_events FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "webhook_service_read" ON webhook_events FOR SELECT USING (auth.role() = 'service_role');
CREATE POLICY "webhook_service_update" ON webhook_events FOR UPDATE USING (auth.role() = 'service_role');
