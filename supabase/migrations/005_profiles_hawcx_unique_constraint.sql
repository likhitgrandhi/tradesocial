-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 005: Proper unique constraint on profiles.hawcx_user_id
--
-- Migration 002 created a *partial* unique index (WHERE hawcx_user_id IS NOT
-- NULL). Partial indexes cannot be used as ON CONFLICT targets by the
-- Supabase client, which breaks the login upsert. Replace with a full
-- UNIQUE constraint — NULLs are allowed (Postgres treats NULLs as distinct).
-- ─────────────────────────────────────────────────────────────────────────────

DROP INDEX IF EXISTS public.profiles_hawcx_user_id_idx;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_hawcx_user_id_key UNIQUE (hawcx_user_id);
