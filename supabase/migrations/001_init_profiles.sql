-- ============================================================
-- Migration 001: profiles
-- Extends Supabase auth.users with public profile data.
-- One row per freelancer, created automatically on signup.
-- ============================================================

CREATE TABLE profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT,
  email       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_profiles_id ON profiles(id);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- A freelancer can only read their own profile
CREATE POLICY "profiles: select own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- A freelancer can only update their own profile
CREATE POLICY "profiles: update own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── Auto-create profile on signup ─────────────────────────────
-- This trigger fires when a new user is created in auth.users
-- and inserts a matching row in profiles automatically.
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
