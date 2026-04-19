import { createServiceClient } from "@/lib/supabase/service"
import type {
  FeedCursor,
  FeedScope,
  PostWithContext,
  PostAuthor,
  TradeAttachment,
} from "./types"
import type { TradeSide, TradeStatus } from "@/lib/trades/types"

function client() {
  return createServiceClient()
}

const SELECT =
  `id, body, created_at, like_count, reply_count, parent_post_id, deleted_at, trade_id, user_id,
   author:profiles!posts_user_id_fkey ( id, username, display_name, avatar_url, is_verified ),
   trade:trades ( id, symbol, side, quantity, entry_price, entry_at, status, exit_price, realized_pnl, currency )`

type FetchRow = {
  id: string
  body: string
  created_at: string
  like_count: number
  reply_count: number
  parent_post_id: string | null
  deleted_at: string | null
  trade_id: string | null
  user_id: string
  author: {
    id: string
    username: string | null
    display_name: string | null
    avatar_url: string | null
    is_verified: boolean
  } | null
  trade: {
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
  } | null
}

type ParentSummary = {
  id: string
  author: { username: string | null; display_name: string | null }
}

async function fetchParentMap(
  parentIds: string[]
): Promise<Map<string, ParentSummary>> {
  if (parentIds.length === 0) return new Map()
  const { data, error } = await client()
    .from("posts")
    .select(
      `id, author:profiles!posts_user_id_fkey ( username, display_name )`
    )
    .in("id", parentIds)
  if (error) throw error
  const map = new Map<string, ParentSummary>()
  const rows = (data ?? []) as unknown as Array<{
    id: string
    author: { username: string | null; display_name: string | null } | null
  }>
  for (const row of rows) {
    map.set(row.id, {
      id: row.id,
      author: {
        username: row.author?.username ?? null,
        display_name: row.author?.display_name ?? null,
      },
    })
  }
  return map
}

function mapRow(
  row: FetchRow,
  viewerLikedSet: Set<string>,
  parentMap: Map<string, ParentSummary>
): PostWithContext {
  const author: PostAuthor = row.author
    ? {
        id: row.author.id,
        username: row.author.username,
        display_name: row.author.display_name,
        avatar_url: row.author.avatar_url,
        is_verified: Boolean(row.author.is_verified),
      }
    : { id: row.user_id, username: null, display_name: null, avatar_url: null, is_verified: false }

  const trade: TradeAttachment | null =
    row.trade && row.trade_id
      ? {
          id: row.trade.id,
          symbol: row.trade.symbol,
          side: row.trade.side,
          quantity: Number(row.trade.quantity),
          entry_price: Number(row.trade.entry_price),
          entry_at: row.trade.entry_at,
          status: row.trade.status,
          exit_price: row.trade.exit_price != null ? Number(row.trade.exit_price) : null,
          realized_pnl: row.trade.realized_pnl != null ? Number(row.trade.realized_pnl) : null,
          currency: row.trade.currency,
        }
      : null

  const parentSummary = row.parent_post_id
    ? parentMap.get(row.parent_post_id) ?? null
    : null

  return {
    id: row.id,
    body: row.body,
    created_at: row.created_at,
    like_count: Number(row.like_count ?? 0),
    reply_count: Number(row.reply_count ?? 0),
    parent_post_id: row.parent_post_id,
    viewer: { liked: viewerLikedSet.has(row.id) },
    author,
    trade,
    parent: parentSummary,
  }
}

function collectParentIds(rows: Pick<FetchRow, "parent_post_id">[]): string[] {
  const ids = new Set<string>()
  for (const r of rows) {
    if (r.parent_post_id) ids.add(r.parent_post_id)
  }
  return Array.from(ids)
}

async function fetchLikedSet(viewerId: string, postIds: string[]): Promise<Set<string>> {
  if (!viewerId || postIds.length === 0) return new Set()
  const { data, error } = await client()
    .from("post_likes")
    .select("post_id")
    .eq("user_id", viewerId)
    .in("post_id", postIds)
  if (error) throw error
  return new Set((data ?? []).map((r) => r.post_id as string))
}

// ── Feed ─────────────────────────────────────────────────────────────────────
export async function listFeed(
  viewerId: string,
  scope: FeedScope,
  cursor: FeedCursor | null,
  limit = 20
): Promise<{ items: PostWithContext[]; nextCursor: FeedCursor | null }> {
  let q = client()
    .from("posts")
    .select(SELECT)
    .is("deleted_at", null)
    .is("parent_post_id", null)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit + 1)

  if (scope === "following") {
    const { data: follows, error: followsErr } = await client()
      .from("follows")
      .select("following_id")
      .eq("follower_id", viewerId)
    if (followsErr) throw followsErr
    const followingIds = (follows ?? []).map((r) => r.following_id as string)
    if (followingIds.length === 0) {
      return { items: [], nextCursor: null }
    }
    q = q.in("user_id", followingIds)
  }

  if (cursor) {
    // (created_at, id) < cursor — composite keyset pagination
    q = q.or(
      `created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`
    )
  }

  const { data, error } = await q
  if (error) throw error
  const rows = (data ?? []) as unknown as FetchRow[]
  const hasMore = rows.length > limit
  const page = hasMore ? rows.slice(0, limit) : rows

  const [liked, parents] = await Promise.all([
    fetchLikedSet(viewerId, page.map((r) => r.id)),
    fetchParentMap(collectParentIds(page)),
  ])
  const items = page.map((r) => mapRow(r, liked, parents))

  const last = page[page.length - 1]
  const nextCursor = hasMore && last ? { created_at: last.created_at, id: last.id } : null
  return { items, nextCursor }
}

// ── Single post ──────────────────────────────────────────────────────────────
export async function getPost(viewerId: string, postId: string): Promise<PostWithContext | null> {
  const { data, error } = await client()
    .from("posts")
    .select(SELECT)
    .eq("id", postId)
    .is("deleted_at", null)
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  const row = data as unknown as FetchRow
  const [liked, parents] = await Promise.all([
    fetchLikedSet(viewerId, [row.id]),
    fetchParentMap(collectParentIds([row])),
  ])
  return mapRow(row, liked, parents)
}

// ── Replies ──────────────────────────────────────────────────────────────────
export async function listReplies(
  viewerId: string,
  parentPostId: string,
  cursor: FeedCursor | null,
  limit = 20
): Promise<{ items: PostWithContext[]; nextCursor: FeedCursor | null }> {
  let q = client()
    .from("posts")
    .select(SELECT)
    .is("deleted_at", null)
    .eq("parent_post_id", parentPostId)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true })
    .limit(limit + 1)

  if (cursor) {
    q = q.or(
      `created_at.gt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.gt.${cursor.id})`
    )
  }

  const { data, error } = await q
  if (error) throw error
  const rows = (data ?? []) as unknown as FetchRow[]
  const hasMore = rows.length > limit
  const page = hasMore ? rows.slice(0, limit) : rows

  const [liked, parents] = await Promise.all([
    fetchLikedSet(viewerId, page.map((r) => r.id)),
    fetchParentMap(collectParentIds(page)),
  ])
  const items = page.map((r) => mapRow(r, liked, parents))
  const last = page[page.length - 1]
  const nextCursor = hasMore && last ? { created_at: last.created_at, id: last.id } : null
  return { items, nextCursor }
}

// ── Profile timeline ─────────────────────────────────────────────────────────
export async function listUserPosts(
  viewerId: string,
  userId: string,
  cursor: FeedCursor | null,
  limit = 20
): Promise<{ items: PostWithContext[]; nextCursor: FeedCursor | null }> {
  let q = client()
    .from("posts")
    .select(SELECT)
    .is("deleted_at", null)
    .is("parent_post_id", null)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(limit + 1)

  if (cursor) {
    q = q.or(
      `created_at.lt.${cursor.created_at},and(created_at.eq.${cursor.created_at},id.lt.${cursor.id})`
    )
  }

  const { data, error } = await q
  if (error) throw error
  const rows = (data ?? []) as unknown as FetchRow[]
  const hasMore = rows.length > limit
  const page = hasMore ? rows.slice(0, limit) : rows

  const [liked, parents] = await Promise.all([
    fetchLikedSet(viewerId, page.map((r) => r.id)),
    fetchParentMap(collectParentIds(page)),
  ])
  const items = page.map((r) => mapRow(r, liked, parents))
  const last = page[page.length - 1]
  const nextCursor = hasMore && last ? { created_at: last.created_at, id: last.id } : null
  return { items, nextCursor }
}

// ── Insert ───────────────────────────────────────────────────────────────────
export async function insertPost(input: {
  user_id: string
  body: string
  trade_id: string | null
  parent_post_id: string | null
}): Promise<string> {
  // Enforce flat reply structure: if parent_post_id is set, parent must itself be a root post.
  if (input.parent_post_id) {
    const { data: parent, error: parentErr } = await client()
      .from("posts")
      .select("id, parent_post_id, deleted_at")
      .eq("id", input.parent_post_id)
      .maybeSingle()
    if (parentErr) throw parentErr
    if (!parent) throw new Error("parent_not_found")
    if (parent.deleted_at) throw new Error("parent_deleted")
    if (parent.parent_post_id) throw new Error("reply_depth_exceeded")
  }

  // Enforce trade ownership
  if (input.trade_id) {
    const { data: trade, error: tradeErr } = await client()
      .from("trades")
      .select("id, user_id")
      .eq("id", input.trade_id)
      .maybeSingle()
    if (tradeErr) throw tradeErr
    if (!trade) throw new Error("trade_not_found")
    if (trade.user_id !== input.user_id) throw new Error("trade_forbidden")
  }

  const { data, error } = await client()
    .from("posts")
    .insert({
      user_id: input.user_id,
      body: input.body,
      trade_id: input.trade_id,
      parent_post_id: input.parent_post_id,
    })
    .select("id")
    .single()
  if (error) throw error
  return (data as { id: string }).id
}

// ── Soft delete ──────────────────────────────────────────────────────────────
export async function softDeletePost(postId: string, userId: string): Promise<boolean> {
  const { data, error } = await client()
    .from("posts")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", postId)
    .eq("user_id", userId)
    .is("deleted_at", null)
    .select("id")
    .maybeSingle()
  if (error) throw error
  return !!data
}

// ── Likes ────────────────────────────────────────────────────────────────────
export async function likePost(postId: string, userId: string): Promise<void> {
  const { error } = await client()
    .from("post_likes")
    .insert({ post_id: postId, user_id: userId })
  if (error && error.code !== "23505") throw error
}

export async function unlikePost(postId: string, userId: string): Promise<void> {
  const { error } = await client()
    .from("post_likes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", userId)
  if (error) throw error
}

export async function getLikeCount(postId: string): Promise<number> {
  const { data, error } = await client()
    .from("posts")
    .select("like_count")
    .eq("id", postId)
    .maybeSingle()
  if (error) throw error
  return data ? Number((data as { like_count: number }).like_count) : 0
}
