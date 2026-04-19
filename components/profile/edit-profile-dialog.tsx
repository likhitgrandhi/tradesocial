"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"

import type { PublicProfile, AssetFocus } from "@/lib/profiles/types"
import { refreshProfile } from "@/hooks/use-profile"

const FOCUSES: { value: AssetFocus; label: string }[] = [
  { value: "STOCKS", label: "Stocks" },
  { value: "CRYPTO", label: "Crypto" },
  { value: "OPTIONS", label: "Options" },
  { value: "FUTURES", label: "Futures" },
  { value: "MIXED", label: "Mixed" },
]

export function EditProfileDialog({
  open,
  onClose,
  profile,
  onSaved,
}: {
  open: boolean
  onClose: () => void
  profile: PublicProfile
  onSaved: (p: PublicProfile) => void
}) {
  const [displayName, setDisplayName] = useState(profile.display_name ?? "")
  const [bio, setBio] = useState(profile.bio ?? "")
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? "")
  const [focus, setFocus] = useState<AssetFocus | "">(profile.asset_focus ?? "")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setDisplayName(profile.display_name ?? "")
    setBio(profile.bio ?? "")
    setAvatarUrl(profile.avatar_url ?? "")
    setFocus(profile.asset_focus ?? "")
    setError(null)
  }, [open, profile])

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!displayName.trim()) {
      setError("Display name is required.")
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/profiles/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          display_name: displayName.trim(),
          bio: bio.trim(),
          avatar_url: avatarUrl.trim(),
          asset_focus: focus || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError("Could not save. Check your inputs.")
        return
      }
      await refreshProfile()
      onSaved(data.profile as PublicProfile)
      onClose()
    } catch {
      setError("Network error. Try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-[var(--radius-xl)] bg-surface-raised border border-border-default p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2
            className="text-content-primary"
            style={{ fontSize: "var(--font-size-18)", fontWeight: "var(--font-weight-medium)" }}
          >
            Edit profile
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center rounded-md text-content-muted hover:text-content-primary hover:bg-surface-muted"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error ? (
          <div className="rounded-[var(--radius-md)] bg-loss/8 border border-loss/20 px-3 py-2 text-loss" style={{ fontSize: "var(--font-size-13)" }}>
            {error}
          </div>
        ) : null}

        <Field label="Display name">
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={40}
            className="w-full h-10 rounded-[var(--radius-md)] px-3 bg-surface-base border border-border-default text-content-primary outline-none focus:border-border-accent"
          />
        </Field>

        <Field label="Bio">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={280}
            rows={3}
            className="w-full resize-none rounded-[var(--radius-md)] px-3 py-2 bg-surface-base border border-border-default text-content-primary outline-none focus:border-border-accent"
          />
        </Field>

        <Field label="Avatar URL">
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://…"
            maxLength={500}
            className="w-full h-10 rounded-[var(--radius-md)] px-3 bg-surface-base border border-border-default text-content-primary outline-none focus:border-border-accent"
          />
        </Field>

        <Field label="Asset focus">
          <div className="flex flex-wrap gap-2">
            {FOCUSES.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFocus(focus === f.value ? "" : f.value)}
                className={
                  "px-3 h-8 rounded-[var(--radius-pill)] border transition-colors " +
                  (focus === f.value
                    ? "bg-surface-accent-subtle border-action-primary text-action-primary"
                    : "bg-surface-base border-border-default text-content-primary hover:bg-surface-muted")
                }
                style={{ fontSize: "var(--font-size-13)", fontWeight: "var(--font-weight-medium)" }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </Field>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 h-9 rounded-[var(--radius-md)] bg-surface-base border border-border-default text-content-primary hover:bg-surface-muted transition-colors"
            style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 h-9 rounded-[var(--radius-md)] bg-action-primary text-content-inverse hover:bg-action-primary-hover transition-colors disabled:opacity-50"
            style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span
        className="text-content-primary"
        style={{ fontSize: "var(--font-size-13)", fontWeight: "var(--font-weight-medium)" }}
      >
        {label}
      </span>
      {children}
    </label>
  )
}
