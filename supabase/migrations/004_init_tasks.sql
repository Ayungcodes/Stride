-- ============================================================
-- Migration 004: tasks
-- Tasks can belong to a project (project_id nullable)
-- or exist independently as standalone to-dos.
-- ============================================================

CREATE TABLE tasks (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  project_id  UUID        REFERENCES projects(id) ON DELETE SET NULL,
  title       TEXT        NOT NULL,
  description TEXT,
  status      TEXT        NOT NULL DEFAULT 'todo'
                          CHECK (status IN ('todo', 'in_progress', 'done')),
  due_date    DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_tasks_user_id    ON tasks(user_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tasks: select own"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "tasks: insert own"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "tasks: update own"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "tasks: delete own"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);
