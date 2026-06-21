-- ============================================================
-- Migration 005: earnings
-- Tracks income per entry. The `date` column is used to group
-- by month/year for the analytics graph and monthly breakdown.
-- project_id is optional — some earnings may not tie to a project.
-- ============================================================

CREATE TABLE earnings (
  id          UUID           PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID           NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id  UUID           REFERENCES projects(id) ON DELETE SET NULL,
  amount      NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  date        DATE           NOT NULL,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_earnings_user_id    ON earnings(user_id);
CREATE INDEX idx_earnings_project_id ON earnings(project_id);

-- Index on (user_id, date) for fast monthly grouping queries
CREATE INDEX idx_earnings_user_date  ON earnings(user_id, date);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "earnings: select own"
  ON earnings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "earnings: insert own"
  ON earnings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "earnings: update own"
  ON earnings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "earnings: delete own"
  ON earnings FOR DELETE
  USING (auth.uid() = user_id);

-- ── Helpful view: monthly earnings per user ───────────────────
-- Use this in your queries instead of writing the GROUP BY every time.
-- e.g. SELECT * FROM monthly_earnings WHERE user_id = auth.uid()
--        AND year = 2025 ORDER BY month;
CREATE VIEW monthly_earnings AS
  SELECT
    user_id,
    DATE_TRUNC('month', date)::DATE  AS month_start,
    EXTRACT(YEAR  FROM date)::INT    AS year,
    EXTRACT(MONTH FROM date)::INT    AS month,
    SUM(amount)                      AS total,
    COUNT(*)                         AS entry_count
  FROM earnings
  GROUP BY user_id, DATE_TRUNC('month', date), year, month;
