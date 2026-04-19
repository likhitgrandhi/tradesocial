"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import type { FeedScope, PostWithContext } from "@/lib/posts/types"
import { ComposeBox } from "./compose-box"
import { PostCard } from "./post-card"
import { PostSkeleton } from "./post-skeleton"
import { LivePricesProvider } from "./live-prices-context"
import { FeedTabs } from "./feed-tabs"
import { SuggestedProfiles } from "./suggested-profiles"

interface FeedResponse {
  items: PostWithContext[]
  nextCursor: string | null
  scope: FeedScope
}

export function FeedView({
  scope,
  initialTradeId,
}: {
  scope: FeedScope
  initialTradeId?: string | null
}) {
  const [items, setItems] = useState<PostWithContext[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const symbols = useMemo(() => {
    const set = new Set<string>()
    for (const p of items) {
      if (p.trade && p.trade.status === "open") set.add(p.trade.symbol)
    }
    return Array.from(set)
  }, [items])

  const load = useCallback(
    async (cursor: string | null, replace: boolean) => {
      const url = new URL("/api/feed", window.location.origin)
      url.searchParams.set("scope", scope)
      if (cursor) url.searchParams.set("cursor", cursor)
      const res = await fetch(url.toString(), { cache: "no-store" })
      if (!res.ok) {
        setError("Could not load feed.")
        return
      }
      const data = (await res.json()) as FeedResponse
      setItems((prev) => (replace ? data.items : [...prev, ...data.items]))
      setNextCursor(data.nextCursor)
    },
    [scope]
  )

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      setError(null)
      setItems([])
      setNextCursor(null)
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
    if (!nextCursor || loading) return
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore && nextCursor) {
          setLoadingMore(true)
          load(nextCursor, false).finally(() => setLoadingMore(false))
        }
      },
      { rootMargin: "200px" }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [nextCursor, loading, loadingMore, load])

  return (
    <div className="space-y-4">
      <FeedTabs scope={scope} />

      <ComposeBox
        initialTradeId={initialTradeId}
        onPosted={(post) => setItems((prev) => [post, ...prev])}
      />

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[var(--radius-xl)] bg-surface-raised border border-border-default p-6 text-center">
          <p className="text-loss" style={{ fontSize: "var(--font-size-14)" }}>
            {error}
          </p>
        </div>
      ) : items.length === 0 ? (
        <div className="space-y-4">
          <div className="rounded-[var(--radius-xl)] bg-surface-raised border border-border-default p-8 text-center space-y-2">
            <p
              className="text-content-primary"
              style={{ fontSize: "var(--font-size-16)", fontWeight: "var(--font-weight-medium)" }}
            >
              {scope === "following" ? "Nothing yet from people you follow" : "No posts yet"}
            </p>
            <p className="text-content-muted" style={{ fontSize: "var(--font-size-14)" }}>
              {scope === "following"
                ? "Follow a few traders to see their posts here."
                : "Be the first to share a trade above."}
            </p>
          </div>
          {scope === "following" ? <SuggestedProfiles /> : null}
        </div>
      ) : (
        <LivePricesProvider symbols={symbols}>
          <div className="space-y-4">
            {items.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onDeleted={(id) => setItems((prev) => prev.filter((p) => p.id !== id))}
              />
            ))}
            {nextCursor ? (
              <div ref={sentinelRef} className="py-4">
                {loadingMore ? <PostSkeleton /> : null}
              </div>
            ) : null}
          </div>
        </LivePricesProvider>
      )}
    </div>
  )
}
