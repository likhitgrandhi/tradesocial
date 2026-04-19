import type { TradeSide, TradeStatus } from "@/lib/trades/types"

export type FeedScope = "for-you" | "following"

export interface PostAuthor {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  is_verified: boolean
}

export interface TradeAttachment {
  id: string
  symbol: string
  side: TradeSide
  quantity: number
  entry_price: number
  entry_at: string
  status: TradeStatus
  exit_price: number | null
  realized_pnl: number | null
  currency: string
  current_price?: number | null
  unrealized_pnl?: number | null
  unrealized_pnl_pct?: number | null
  stale?: boolean
}

export interface PostParentRef {
  id: string
  author: { username: string | null; display_name: string | null }
}

export interface PostWithContext {
  id: string
  body: string
  created_at: string
  like_count: number
  reply_count: number
  parent_post_id: string | null
  viewer: { liked: boolean }
  author: PostAuthor
  trade: TradeAttachment | null
  parent: PostParentRef | null
}

export interface FeedCursor {
  created_at: string
  id: string
}

export function encodeCursor(c: FeedCursor): string {
  return `${c.created_at}_${c.id}`
}

// Cursor parts flow into a PostgREST .or() filter string — validate strictly
// so attacker-controlled input can't inject extra filter conditions.
const ISO_TS_RE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function decodeCursor(s: string | null | undefined): FeedCursor | null {
  if (!s) return null
  const idx = s.lastIndexOf("_")
  if (idx < 0) return null
  const created_at = s.slice(0, idx)
  const id = s.slice(idx + 1)
  if (!ISO_TS_RE.test(created_at) || !UUID_RE.test(id)) return null
  return { created_at, id }
}
