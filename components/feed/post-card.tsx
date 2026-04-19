"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { BadgeCheck } from "lucide-react"

import type { PostWithContext } from "@/lib/posts/types"
import { useProfile } from "@/hooks/use-profile"
import { PostActionBar } from "./post-action-bar"
import { TradeAttachmentCard } from "./trade-attachment-card"
import { RelativeTime } from "./relative-time"
import { DeletePostMenu } from "./delete-post-menu"

function getInitials(display: string | null, username: string | null): string {
  const src = (display?.trim() || username || "?").trim()
  const parts = src.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return src.slice(0, 2).toUpperCase()
}

export function PostCard({
  post,
  showTradePlaceholder = true,
  clickable = true,
  onDeleted,
}: {
  post: PostWithContext
  showTradePlaceholder?: boolean
  clickable?: boolean
  onDeleted?: (id: string) => void
}) {
  const router = useRouter()
  const { profile } = useProfile()
  const author = post.author
  const profileHref = author.username ? `/u/${author.username}` : null
  const isOwnPost = profile?.userId === author.id

  const onCardClick = () => {
    if (!clickable) return
    router.push(`/p/${post.id}`)
  }

  return (
    <article
      className={`rounded-[var(--radius-xl)] bg-surface-raised border border-border-default p-4 space-y-3 ${
        clickable ? "cursor-pointer hover:bg-surface-muted/50 transition-colors" : ""
      }`}
      onClick={onCardClick}
    >
      <header className="flex items-center gap-3">
        {profileHref ? (
          <Link
            href={profileHref}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0"
          >
            <Avatar url={author.avatar_url} fallback={getInitials(author.display_name, author.username)} />
          </Link>
        ) : (
          <Avatar url={author.avatar_url} fallback={getInitials(author.display_name, author.username)} />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            {profileHref ? (
              <Link
                href={profileHref}
                onClick={(e) => e.stopPropagation()}
                className="text-content-primary hover:underline truncate"
                style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
              >
                {author.display_name || author.username || "Unknown"}
              </Link>
            ) : (
              <span
                className="text-content-primary truncate"
                style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
              >
                Unknown
              </span>
            )}
            {author.is_verified ? (
              <BadgeCheck className="w-3.5 h-3.5 text-action-primary shrink-0" />
            ) : null}
          </div>
          <div className="flex items-center gap-1 text-content-muted" style={{ fontSize: "var(--font-size-12)" }}>
            {author.username ? <span className="truncate">@{author.username}</span> : null}
            <span>·</span>
            <RelativeTime ts={post.created_at} />
          </div>
        </div>
        {isOwnPost ? (
          <DeletePostMenu
            postId={post.id}
            onDeleted={() => (onDeleted ? onDeleted(post.id) : router.refresh())}
          />
        ) : null}
      </header>

      {post.parent ? (
        <div className="text-content-muted" style={{ fontSize: "var(--font-size-12)" }}>
          Replying to{" "}
          <Link
            href={post.parent.author.username ? `/u/${post.parent.author.username}` : `/p/${post.parent.id}`}
            onClick={(e) => e.stopPropagation()}
            className="text-action-primary hover:underline"
          >
            @{post.parent.author.username ?? "user"}
          </Link>
        </div>
      ) : null}

      <p
        className="whitespace-pre-wrap break-words text-content-primary"
        style={{ fontSize: "var(--font-size-14)", lineHeight: "20px" }}
      >
        {post.body}
      </p>

      {post.trade ? (
        <TradeAttachmentCard trade={post.trade} />
      ) : post.trade === null && post.parent === null && showTradePlaceholder ? null : null}

      <PostActionBar
        postId={post.id}
        liked={post.viewer.liked}
        likeCount={post.like_count}
        replyCount={post.reply_count}
      />
    </article>
  )
}

function Avatar({ url, fallback }: { url: string | null; fallback: string }) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        className="w-10 h-10 rounded-full object-cover bg-surface-accent-subtle"
      />
    )
  }
  return (
    <div
      className="w-10 h-10 rounded-full bg-surface-accent-subtle flex items-center justify-center text-action-primary"
      style={{ fontSize: "var(--font-size-12)", fontWeight: "var(--font-weight-bold)" }}
    >
      {fallback}
    </div>
  )
}
