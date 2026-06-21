-- ============================================================
-- Migration 002: clients
-- Each client belongs to one freelancer (user_id).
-- ============================================================

CREATE TABLE clients (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT        NOT NULL,
  email       TEXT,
  phone       TEXT,
  address     TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_clients_user_id ON clients(user_id);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- A freelancer can only see their own clients
CREATE POLICY "clients: select own"
  ON clients FOR SELECT
  USING (auth.uid() = user_id);

-- A freelancer can only insert clients for themselves
CREATE POLICY "clients: insert own"
  ON clients FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- A freelancer can only update their own clients
CREATE POLICY "clients: update own"
  ON clients FOR UPDATE
  USING (auth.uid() = user_id);

-- A freelancer can only delete their own clients
CREATE POLICY "clients: delete own"
  ON clients FOR DELETE
  USING (auth.uid() = user_id);
