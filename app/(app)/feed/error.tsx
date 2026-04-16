"use client"

import { useEffect } from "react"

export default function FeedError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <p className="text-[#141413] dark:text-[#F3F0EE] font-medium">
        Something went wrong loading the feed.
      </p>
      <button
        onClick={reset}
        className="px-5 py-2 rounded-full bg-[#141413] dark:bg-[#F3F0EE] text-[#F3F0EE] dark:text-[#141413] text-sm font-medium hover:opacity-90 transition-opacity"
      >
        Try again
      </button>
    </div>
  )
}
