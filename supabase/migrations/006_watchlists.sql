-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 006: watchlists
--
-- Per-user watchlist. One row per (user, symbol) pair.
-- Writes go through the app server using the service role key; direct
-- client inserts/deletes are denied by RLS.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.watchlists (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  symbol     text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),

  UNIQUE (user_id, symbol)
);

CREATE INDEX idx_watchlists_user ON public.watchlists (user_id);

ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "watchlists: server select"
  ON public.watchlists FOR SELECT USING (false);

CREATE POLICY "watchlists: server insert"
  ON public.watchlists FOR INSERT WITH CHECK (false);

CREATE POLICY "watchlists: server delete"
  ON public.watchlists FOR DELETE USING (false);
