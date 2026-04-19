"use client"

import { useCallback, useEffect, useMemo, useState } from "react"

import type { PostWithContext } from "@/lib/posts/types"
import { PostCard } from "@/components/feed/post-card"
import { PostSkeleton } from "@/components/feed/post-skeleton"
import { LivePricesProvider } from "@/components/feed/live-prices-context"

interface Resp {
  items: PostWithContext[]
  nextCursor: string | null
}

export function ProfileTimeline({ username }: { username: string }) {
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
      const url = new URL(
        `/api/profiles/${encodeURIComponent(username)}/posts`,
        window.location.origin
      )
      if (cursor) url.searchParams.set("cursor", cursor)
      const res = await fetch(url.toString(), { cache: "no-store" })
      if (!res.ok) return
      const data = (await res.json()) as Resp
      setItems((prev) => (replace ? data.items : [...prev, ...data.items]))
      setNextCursor(data.nextCursor)
    },
    [username]
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

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="rounded-[var(--radius-xl)] bg-surface-raised border border-border-default p-6 text-center text-content-muted" style={{ fontSize: "var(--font-size-14)" }}>
        No posts yet.
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
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        ) : null}
      </div>
    </LivePricesProvider>
  )
}
