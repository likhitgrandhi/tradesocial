"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import type { PostWithContext } from "@/lib/posts/types"
import { AttachTradePicker, type AttachedTrade } from "./attach-trade-picker"

const MAX_BODY = 500

interface Props {
  parentPostId?: string | null
  placeholder?: string
  autoFocus?: boolean
  onPosted?: (post: PostWithContext) => void
  initialTradeId?: string | null
}

export function ComposeBox({
  parentPostId = null,
  placeholder,
  autoFocus = false,
  onPosted,
  initialTradeId = null,
}: Props) {
  const router = useRouter()
  const [body, setBody] = useState("")
  const [attached, setAttached] = useState<AttachedTrade | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const bootstrappedRef = useRef(false)

  useEffect(() => {
    if (bootstrappedRef.current || !initialTradeId) return
    bootstrappedRef.current = true
    // Fetch the specific trade to pre-fill the picker
    fetch("/api/trades?status=open", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { trades: AttachedTrade[] } | null) => {
        const match = data?.trades.find((t) => t.id === initialTradeId)
        if (match) setAttached(match)
      })
      .catch(() => {})
  }, [initialTradeId])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmed = body.trim()
    if (!trimmed) return
    if (trimmed.length > MAX_BODY) {
      setError(`Post is too long (${trimmed.length}/${MAX_BODY}).`)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: trimmed,
          trade_id: attached?.id ?? null,
          parent_post_id: parentPostId,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error === "rate_limited") setError("Too fast. Try again in a moment.")
        else if (data.error === "trade_forbidden") setError("You can only attach your own trades.")
        else if (data.error === "reply_depth_exceeded") setError("Replies can't be nested further.")
        else setError("Could not post. Try again.")
        return
      }
      setBody("")
      setAttached(null)
      if (onPosted) onPosted(data.post as PostWithContext)
      else router.refresh()
    } catch {
      setError("Network error. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault()
      void submit(e as unknown as React.FormEvent)
    }
  }

  const remaining = MAX_BODY - body.length

  return (
    <form
      onSubmit={submit}
      className="rounded-[var(--radius-xl)] bg-surface-raised border border-border-default p-4 space-y-3"
    >
      <textarea
        ref={textareaRef}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={onKeyDown}
        autoFocus={autoFocus}
        placeholder={placeholder ?? (parentPostId ? "Write a reply…" : "Share a trade or what you're watching…")}
        rows={3}
        className="w-full resize-none bg-transparent text-content-primary placeholder:text-content-disabled outline-none"
        style={{ fontSize: "var(--font-size-14)", lineHeight: "20px" }}
      />

      {error ? (
        <div
          className="rounded-[var(--radius-md)] bg-loss/8 border border-loss/20 px-3 py-2 text-loss"
          style={{ fontSize: "var(--font-size-13)" }}
        >
          {error}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3">
        <AttachTradePicker attached={attached} onChange={setAttached} />
        <div className="flex items-center gap-3">
          <span
            className={
              "text-content-muted " + (remaining < 40 ? (remaining < 0 ? "text-loss" : "text-content-secondary") : "")
            }
            style={{ fontSize: "var(--font-size-12)" }}
            aria-live="polite"
          >
            {remaining}
          </span>
          <button
            type="submit"
            disabled={submitting || !body.trim() || remaining < 0}
            className="px-4 h-9 rounded-[var(--radius-md)] bg-action-primary text-content-inverse hover:bg-action-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
          >
            {submitting ? "Posting…" : parentPostId ? "Reply" : "Post"}
          </button>
        </div>
      </div>
    </form>
  )
}
