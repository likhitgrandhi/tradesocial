-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 002: Decouple profiles from Supabase Auth
--
-- Auth is now handled by Hawcx. We no longer create rows in auth.users,
-- so the FK and trigger that depended on auth.users inserts are removed.
-- Profiles are created by the app server using the service role key.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Drop FK: profiles.id no longer mirrors auth.users.id
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Drop trigger + function that auto-created profiles on auth.users INSERT
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Drop auth.uid()-based RLS policies (service role bypasses RLS for writes)
DROP POLICY IF EXISTS "profiles: self insert" ON public.profiles;
DROP POLICY IF EXISTS "profiles: self update" ON public.profiles;

-- 4. Deny direct client insert/update — all writes go through the app server
CREATE POLICY "profiles: server insert"
  ON public.profiles FOR INSERT
  WITH CHECK (false);

CREATE POLICY "profiles: server update"
  ON public.profiles FOR UPDATE
  USING (false);

-- 5. Add Hawcx user identifier for idempotent upserts on every login
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS hawcx_user_id text,
  ADD COLUMN IF NOT EXISTS email text;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_hawcx_user_id_idx
  ON public.profiles (hawcx_user_id)
  WHERE hawcx_user_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_idx
  ON public.profiles (email)
  WHERE email IS NOT NULL;
