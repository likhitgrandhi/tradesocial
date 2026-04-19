"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { PostWithContext } from "@/lib/posts/types"
import { PostCard } from "./post-card"
import { PostSkeleton } from "./post-skeleton"
import { LivePricesProvider } from "./live-prices-context"

interface RepliesResponse {
  items: PostWithContext[]
  nextCursor: string | null
}

export function ReplyList({
  postId,
  onPrepend,
}: {
  postId: string
  onPrepend?: (fn: (reply: PostWithContext) => void) => void
}) {
  const [items, setItems] = useState<PostWithContext[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const symbols = useMemo(() => {
    const set = new Set<string>()
    for (const p of items) {
      if (p.trade && p.trade.status === "open") set.add(p.trade.symbol)
    }
    return Array.from(set)
  }, [items])

  const load = useCallback(
    async (cursor: string | null, replace: boolean) => {
      const url = new URL(`/api/posts/${postId}/replies`, window.location.origin)
      if (cursor) url.searchParams.set("cursor", cursor)
      const res = await fetch(url.toString(), { cache: "no-store" })
      if (!res.ok) return
      const data = (await res.json()) as RepliesResponse
      setItems((prev) => (replace ? data.items : [...prev, ...data.items]))
      setNextCursor(data.nextCursor)
    },
    [postId]
  )

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      try {
        await load(null, true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    void run()
    return () => {
      cancelled = true
    }
  }, [load])

  useEffect(() => {
    if (onPrepend) {
      onPrepend((reply) => setItems((prev) => [reply, ...prev]))
    }
  }, [onPrepend])

  if (loading) {
    return (
      <div className="space-y-4">
        <PostSkeleton />
        <PostSkeleton />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div
        className="text-center py-6 text-content-muted"
        style={{ fontSize: "var(--font-size-14)" }}
      >
        No replies yet. Be the first.
      </div>
    )
  }

  return (
    <LivePricesProvider symbols={symbols}>
      <div className="space-y-4">
        {items.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            onDeleted={(id) => setItems((prev) => prev.filter((x) => x.id !== id))}
          />
        ))}
        {nextCursor ? (
          <button
            onClick={() => {
              setLoadingMore(true)
              load(nextCursor, false).finally(() => setLoadingMore(false))
            }}
            disabled={loadingMore}
            className="w-full py-2 text-content-muted hover:text-content-primary transition-colors"
            style={{ fontSize: "var(--font-size-13)" }}
          >
            {loadingMore ? "Loading…" : "Load more replies"}
          </button>
        ) : null}
      </div>
    </LivePricesProvider>
  )
}
