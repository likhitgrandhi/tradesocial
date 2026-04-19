"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import type { FeedScope } from "@/lib/posts/types"

const TABS: { value: FeedScope; label: string }[] = [
  { value: "for-you", label: "For You" },
  { value: "following", label: "Following" },
]

export function FeedTabs({ scope }: { scope: FeedScope }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const select = useCallback(
    (next: FeedScope) => {
      const params = new URLSearchParams(searchParams.toString())
      if (next === "for-you") {
        params.delete("tab")
      } else {
        params.set("tab", next)
      }
      const qs = params.toString()
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  return (
    <div
      role="tablist"
      className="flex items-center gap-1 border-b border-border-default"
    >
      {TABS.map((tab) => {
        const active = scope === tab.value
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => select(tab.value)}
            className={
              "relative px-4 h-10 transition-colors " +
              (active
                ? "text-content-primary"
                : "text-content-muted hover:text-content-primary")
            }
            style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
          >
            {tab.label}
            {active ? (
              <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-action-primary" />
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
