"use client"

import Link from "next/link"
import { useState } from "react"
import { Heart, MessageCircle } from "lucide-react"

interface Props {
  postId: string
  liked: boolean
  likeCount: number
  replyCount: number
  onLikeChange?: (liked: boolean, count: number) => void
}

export function PostActionBar({ postId, liked, likeCount, replyCount, onLikeChange }: Props) {
  const [optimisticLiked, setOptimisticLiked] = useState(liked)
  const [optimisticCount, setOptimisticCount] = useState(likeCount)
  const [pending, setPending] = useState(false)

  async function toggleLike(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (pending) return
    const nextLiked = !optimisticLiked
    const nextCount = Math.max(0, optimisticCount + (nextLiked ? 1 : -1))
    setOptimisticLiked(nextLiked)
    setOptimisticCount(nextCount)
    setPending(true)
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: nextLiked ? "POST" : "DELETE",
      })
      if (!res.ok) throw new Error("like failed")
      onLikeChange?.(nextLiked, nextCount)
    } catch {
      setOptimisticLiked(!nextLiked)
      setOptimisticCount(likeCount)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="flex items-center gap-6 text-content-muted" style={{ fontSize: "var(--font-size-13)" }}>
      <Link
        href={`/p/${postId}`}
        className="flex items-center gap-1.5 hover:text-content-primary transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <MessageCircle className="w-4 h-4" />
        {replyCount > 0 ? replyCount : null}
      </Link>
      <button
        onClick={toggleLike}
        disabled={pending}
        aria-pressed={optimisticLiked}
        aria-live="polite"
        className={`flex items-center gap-1.5 transition-colors ${
          optimisticLiked ? "text-loss" : "hover:text-content-primary"
        }`}
      >
        <Heart className={`w-4 h-4 ${optimisticLiked ? "fill-current" : ""}`} />
        {optimisticCount > 0 ? optimisticCount : null}
      </button>
    </div>
  )
}
