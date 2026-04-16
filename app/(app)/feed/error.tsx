"use client"

import { useEffect } from "react"

export default function FeedError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => { console.error(error) }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <p className="text-content-primary" style={{ fontWeight: "var(--font-weight-medium)" }}>
        Something went wrong loading the feed.
      </p>
      <button
        onClick={reset}
        className="h-10 px-5 rounded-[var(--radius-md)] bg-action-primary text-content-inverse hover:bg-action-primary-hover transition-colors"
        style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
      >
        Try again
      </button>
    </div>
  )
}
