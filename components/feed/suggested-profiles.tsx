"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BadgeCheck } from "lucide-react"

import type { PublicProfile } from "@/lib/profiles/types"
import { FollowButton } from "@/components/profile/follow-button"

export function SuggestedProfiles() {
  const [profiles, setProfiles] = useState<PublicProfile[] | null>(null)

  useEffect(() => {
    fetch("/api/profiles/suggested", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { profiles: PublicProfile[] } | null) => {
        setProfiles(data?.profiles ?? [])
      })
      .catch(() => setProfiles([]))
  }, [])

  if (!profiles || profiles.length === 0) return null

  return (
    <div className="rounded-[var(--radius-xl)] bg-surface-raised border border-border-default p-5 space-y-3">
      <h3
        className="text-content-primary"
        style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
      >
        Suggested traders to follow
      </h3>
      <ul className="space-y-2">
        {profiles.map((p) => (
          <li key={p.id} className="flex items-center gap-3">
            <Link href={p.username ? `/u/${p.username}` : "#"} className="shrink-0">
              <div
                className="w-10 h-10 rounded-full bg-surface-accent-subtle flex items-center justify-center text-action-primary overflow-hidden"
                style={{ fontSize: "var(--font-size-12)", fontWeight: "var(--font-weight-bold)" }}
              >
                {p.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.avatar_url} alt="" className="w-full h-full object-cover" />
                ) : (
                  (p.display_name || p.username || "??").slice(0, 2).toUpperCase()
                )}
              </div>
            </Link>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <Link
                  href={p.username ? `/u/${p.username}` : "#"}
                  className="text-content-primary truncate hover:underline"
                  style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
                >
                  {p.display_name || p.username}
                </Link>
                {p.is_verified ? (
                  <BadgeCheck className="w-3.5 h-3.5 text-action-primary shrink-0" />
                ) : null}
              </div>
              {p.username ? (
                <div className="text-content-muted truncate" style={{ fontSize: "var(--font-size-12)" }}>
                  @{p.username}
                </div>
              ) : null}
            </div>
            {p.username ? (
              <FollowButton username={p.username} initialFollowing={false} />
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  )
}
