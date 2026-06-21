-- ============================================================
-- Migration 003: projects
-- Each project belongs to a freelancer and optionally a client.
-- Priority is computed on the frontend from due_date — not stored.
-- ============================================================

CREATE TABLE projects (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id   UUID        REFERENCES clients(id) ON DELETE SET NULL,
  name        TEXT        NOT NULL,
  details     TEXT,
  start_date  DATE,
  due_date    DATE,
  status      TEXT        NOT NULL DEFAULT 'active'
                          CHECK (status IN ('active', 'completed', 'on_hold')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_projects_user_id   ON projects(user_id);
CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_due_date  ON projects(due_date);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects: select own"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "projects: insert own"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects: update own"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "projects: delete own"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);
