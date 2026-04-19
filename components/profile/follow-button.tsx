"use client"

import { useState } from "react"

export function FollowButton({
  username,
  initialFollowing,
  onChange,
}: {
  username: string
  initialFollowing: boolean
  onChange?: (following: boolean) => void
}) {
  const [following, setFollowing] = useState(initialFollowing)
  const [pending, setPending] = useState(false)

  async function toggle() {
    if (pending) return
    const next = !following
    setFollowing(next)
    setPending(true)
    try {
      const res = await fetch(`/api/follows/${encodeURIComponent(username)}`, {
        method: next ? "POST" : "DELETE",
      })
      if (!res.ok) throw new Error("follow failed")
      onChange?.(next)
    } catch {
      setFollowing(!next)
    } finally {
      setPending(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-pressed={following}
      aria-live="polite"
      className={
        "px-4 h-9 rounded-[var(--radius-md)] transition-colors disabled:opacity-60 " +
        (following
          ? "bg-surface-raised border border-border-default text-content-primary hover:bg-surface-muted"
          : "bg-action-primary text-content-inverse hover:bg-action-primary-hover")
      }
      style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
    >
      {following ? "Following" : "Follow"}
    </button>
  )
}
