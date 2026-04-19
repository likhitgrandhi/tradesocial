-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 004: Give profiles.id a default
--
-- Migration 001 defined profiles.id as a uuid PK that mirrored auth.users.id.
-- Migration 002 decoupled from auth.users but left profiles.id with no
-- default, so INSERTs that don't supply an id (the Hawcx profile upsert)
-- fail with a not-null violation. This adds the missing default.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE public.profiles
  ALTER COLUMN id SET DEFAULT gen_random_uuid();
