"use client"

import { useState } from "react"
import { BadgeCheck } from "lucide-react"

import type { PublicProfile } from "@/lib/profiles/types"
import { FollowButton } from "./follow-button"
import { EditProfileDialog } from "./edit-profile-dialog"

function getInitials(display: string | null, username: string | null): string {
  const src = (display?.trim() || username || "?").trim()
  const parts = src.split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return src.slice(0, 2).toUpperCase()
}

export function ProfileHeader({
  profile: initialProfile,
  isSelf,
  isFollowing,
}: {
  profile: PublicProfile
  isSelf: boolean
  isFollowing: boolean
}) {
  const [profile, setProfile] = useState(initialProfile)
  const [editing, setEditing] = useState(false)

  return (
    <div className="rounded-[var(--radius-xl)] bg-surface-raised border border-border-default p-5 space-y-4">
      <div className="flex items-start gap-4">
        <Avatar
          url={profile.avatar_url}
          fallback={getInitials(profile.display_name, profile.username)}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h1
              className="text-content-primary truncate"
              style={{ fontSize: "var(--font-size-20)", fontWeight: "var(--font-weight-medium)" }}
            >
              {profile.display_name || profile.username || "Unnamed"}
            </h1>
            {profile.is_verified ? (
              <BadgeCheck className="w-4 h-4 text-action-primary shrink-0" />
            ) : null}
          </div>
          {profile.username ? (
            <div
              className="text-content-muted"
              style={{ fontSize: "var(--font-size-14)" }}
            >
              @{profile.username}
            </div>
          ) : null}
        </div>
        <div className="shrink-0">
          {isSelf ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="px-4 h-9 rounded-[var(--radius-md)] bg-surface-base border border-border-default text-content-primary hover:bg-surface-muted transition-colors"
              style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
            >
              Edit profile
            </button>
          ) : profile.username ? (
            <FollowButton username={profile.username} initialFollowing={isFollowing} />
          ) : null}
        </div>
      </div>

      <EditProfileDialog
        open={editing}
        onClose={() => setEditing(false)}
        profile={profile}
        onSaved={setProfile}
      />

      {profile.bio ? (
        <p
          className="whitespace-pre-wrap text-content-primary"
          style={{ fontSize: "var(--font-size-14)", lineHeight: "20px" }}
        >
          {profile.bio}
        </p>
      ) : null}

      <div className="flex items-center gap-5 text-content-muted" style={{ fontSize: "var(--font-size-13)" }}>
        <div>
          <span
            className="text-content-primary mr-1"
            style={{ fontWeight: "var(--font-weight-medium)" }}
          >
            {profile.following_count}
          </span>
          Following
        </div>
        <div>
          <span
            className="text-content-primary mr-1"
            style={{ fontWeight: "var(--font-weight-medium)" }}
          >
            {profile.followers_count}
          </span>
          Followers
        </div>
      </div>
    </div>
  )
}

function Avatar({ url, fallback }: { url: string | null; fallback: string }) {
  if (url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt=""
        className="w-16 h-16 rounded-full object-cover bg-surface-accent-subtle"
      />
    )
  }
  return (
    <div
      className="w-16 h-16 rounded-full bg-surface-accent-subtle flex items-center justify-center text-action-primary"
      style={{ fontSize: "var(--font-size-20)", fontWeight: "var(--font-weight-bold)" }}
    >
      {fallback}
    </div>
  )
}
