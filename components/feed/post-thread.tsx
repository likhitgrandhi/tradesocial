"use client"

import { useCallback, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import type { PostWithContext } from "@/lib/posts/types"
import { PostCard } from "./post-card"
import { ComposeBox } from "./compose-box"
import { ReplyList } from "./reply-list"
import { LivePricesProvider } from "./live-prices-context"

export function PostThread({ initial }: { initial: PostWithContext }) {
  const router = useRouter()
  const [rootPost, setRootPost] = useState<PostWithContext | null>(initial)
  const prependRef = useRef<((reply: PostWithContext) => void) | null>(null)

  const bindPrepend = useCallback((fn: (reply: PostWithContext) => void) => {
    prependRef.current = fn
  }, [])

  if (!rootPost) {
    return (
      <div
        className="rounded-[var(--radius-xl)] bg-surface-raised border border-border-default p-6 text-center text-content-muted"
        style={{ fontSize: "var(--font-size-14)" }}
      >
        This post was deleted.
      </div>
    )
  }

  const symbols =
    rootPost.trade && rootPost.trade.status === "open" ? [rootPost.trade.symbol] : []

  return (
    <div className="space-y-4">
      <LivePricesProvider symbols={symbols}>
        <PostCard
          post={rootPost}
          clickable={false}
          onDeleted={() => {
            setRootPost(null)
            router.push("/feed")
          }}
        />
      </LivePricesProvider>

      <ComposeBox
        parentPostId={rootPost.id}
        placeholder={`Reply to @${rootPost.author.username ?? "user"}…`}
        onPosted={(reply) => {
          prependRef.current?.(reply)
          setRootPost((r) => (r ? { ...r, reply_count: r.reply_count + 1 } : r))
        }}
      />

      <div className="pt-2">
        <h2
          className="text-content-secondary mb-3"
          style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
        >
          Replies
        </h2>
        <ReplyList postId={rootPost.id} onPrepend={bindPrepend} />
      </div>
    </div>
  )
}
