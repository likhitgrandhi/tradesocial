-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 008: Username format + case-insensitive uniqueness
--
-- Profiles currently allow arbitrary text usernames with case-sensitive unique.
-- Social URLs (/u/[username]) and @handles need:
--   • lowercase-only, 3–20 chars, alphanumeric + underscore
--   • case-insensitive uniqueness (Alice == alice)
--
-- We don't flip username to NOT NULL yet — existing profiles with null
-- username will complete onboarding on next login. That migration follows
-- once backfill completes.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Format check: lowercase letters, digits, underscore, 3–20 chars
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_username_format
  CHECK (username IS NULL OR username ~ '^[a-z0-9_]{3,20}$');

-- 2. Drop the case-sensitive unique index and add a case-insensitive one.
--    The original `UNIQUE` keyword on the column created an implicit index
--    named `profiles_username_key`.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_username_key;
DROP INDEX IF EXISTS public.profiles_username_idx;

CREATE UNIQUE INDEX profiles_username_ci_idx
  ON public.profiles (lower(username))
  WHERE username IS NOT NULL;
