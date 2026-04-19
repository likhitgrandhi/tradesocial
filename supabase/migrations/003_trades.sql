-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 003: trades
--
-- Core trade-log record. One row per position. Full-close only for MVP;
-- partial closes can later migrate to a `trade_events` child table without
-- a breaking change to this schema.
--
-- Writes go through the app server using the service role key; direct
-- client inserts/updates are denied by RLS.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE public.trades (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,

  -- Symbol identity
  symbol          text NOT NULL,
  provider_symbol text NOT NULL,
  asset_type      text NOT NULL CHECK (asset_type IN ('stock','crypto','forex','fund','index')),
  currency        text NOT NULL DEFAULT 'USD',

  -- Position
  side            text NOT NULL CHECK (side IN ('long','short')),
  quantity        numeric(20, 8) NOT NULL CHECK (quantity > 0),
  entry_price     numeric(20, 8) NOT NULL CHECK (entry_price > 0),
  entry_at        timestamptz NOT NULL,
  exit_price      numeric(20, 8),
  exit_at         timestamptz,
  realized_pnl    numeric(20, 8),
  fees            numeric(20, 8) NOT NULL DEFAULT 0 CHECK (fees >= 0),

  -- Context
  notes           text,
  source          text NOT NULL DEFAULT 'manual' CHECK (source IN ('manual','import','broker')),
  status          text NOT NULL DEFAULT 'open' CHECK (status IN ('open','closed')),
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb,

  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT trades_closed_has_exit CHECK (
    (status = 'open'  AND exit_price IS NULL AND exit_at IS NULL AND realized_pnl IS NULL)
    OR
    (status = 'closed' AND exit_price IS NOT NULL AND exit_at IS NOT NULL AND realized_pnl IS NOT NULL)
  )
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX idx_trades_user_status   ON public.trades (user_id, status);
CREATE INDEX idx_trades_user_entry_at ON public.trades (user_id, entry_at DESC);

-- ── Row Level Security ───────────────────────────────────────────────────────
ALTER TABLE public.trades ENABLE ROW LEVEL SECURITY;

-- Deny direct client reads/writes — all access flows through the app server,
-- which enforces auth via iron-session and filters by user_id.
CREATE POLICY "trades: server select"
  ON public.trades FOR SELECT
  USING (false);

CREATE POLICY "trades: server insert"
  ON public.trades FOR INSERT
  WITH CHECK (false);

CREATE POLICY "trades: server update"
  ON public.trades FOR UPDATE
  USING (false);

CREATE POLICY "trades: server delete"
  ON public.trades FOR DELETE
  USING (false);

-- ── updated_at trigger (reuses set_updated_at() from migration 001) ──────────
CREATE TRIGGER trades_set_updated_at
  BEFORE UPDATE ON public.trades
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
