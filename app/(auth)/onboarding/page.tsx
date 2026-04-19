"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { validateUsername } from "@/lib/profiles/username"
import { refreshProfile } from "@/hooks/use-profile"

type AssetFocus = "STOCKS" | "CRYPTO" | "OPTIONS" | "FUTURES" | "MIXED"

const ASSET_FOCUSES: { value: AssetFocus; label: string }[] = [
  { value: "STOCKS", label: "Stocks" },
  { value: "CRYPTO", label: "Crypto" },
  { value: "OPTIONS", label: "Options" },
  { value: "FUTURES", label: "Futures" },
  { value: "MIXED", label: "Mixed" },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [focus, setFocus] = useState<AssetFocus | "">("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // If the user is already onboarded (or not logged in), route them away.
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) {
          router.replace("/login")
        } else if (data.onboarding_completed) {
          router.replace("/feed")
        }
      })
      .catch(() => {})
  }, [router])

  const usernameCheck = username ? validateUsername(username) : null
  const usernameError = usernameCheck && !usernameCheck.ok ? usernameCheck.reason : null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!usernameCheck || !usernameCheck.ok) {
      setError("Please choose a valid username.")
      return
    }
    if (!displayName.trim()) {
      setError("Please enter a display name.")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/onboarding/username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameCheck.normalized,
          display_name: displayName.trim(),
          asset_focus: focus || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.error === "username_taken") {
          setError("That username is already taken.")
        } else if (data.error === "invalid_username") {
          setError(data.message ?? "Invalid username.")
        } else {
          setError("Could not complete onboarding. Try again.")
        }
        return
      }
      await refreshProfile()
      router.push("/feed")
    } catch {
      setError("Network error. Try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-[400px] space-y-6">
      <div>
        <h1
          className="text-content-secondary"
          style={{ fontSize: "var(--font-size-24)", fontWeight: "var(--font-weight-medium)", lineHeight: "32px" }}
        >
          Pick your handle
        </h1>
        <p className="text-content-muted mt-1" style={{ fontSize: "var(--font-size-14)" }}>
          This is how other traders will find you.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="rounded-[var(--radius-xl)] bg-surface-raised border border-border-default p-5 space-y-4"
      >
        {error && (
          <div className="rounded-[var(--radius-md)] bg-loss/8 border border-loss/20 px-4 py-3">
            <p
              className="text-loss"
              style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
            >
              {error}
            </p>
          </div>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="username"
            className="text-content-primary"
            style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
          >
            Username
          </label>
          <div className="flex items-center rounded-[var(--radius-md)] bg-surface-base border border-border-default focus-within:border-border-accent">
            <span
              className="pl-3 text-content-muted"
              style={{ fontSize: "var(--font-size-14)" }}
            >
              @
            </span>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="off"
              spellCheck={false}
              placeholder="alice"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={20}
              className="w-full h-10 px-2 bg-transparent text-content-primary placeholder:text-content-disabled outline-none"
            />
          </div>
          {usernameError && (
            <p className="text-loss" style={{ fontSize: "var(--font-size-12)" }}>
              {usernameError}
            </p>
          )}
          {!usernameError && (
            <p className="text-content-muted" style={{ fontSize: "var(--font-size-12)" }}>
              3–20 lowercase letters, numbers, or underscores.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="display_name"
            className="text-content-primary"
            style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
          >
            Display name
          </label>
          <input
            id="display_name"
            name="display_name"
            type="text"
            placeholder="Alice Smith"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            maxLength={40}
            className="w-full h-10 rounded-[var(--radius-md)] px-4 bg-surface-base border border-border-default text-content-primary placeholder:text-content-disabled outline-none focus:border-border-accent transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label
            className="text-content-primary"
            style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
          >
            What do you trade? <span className="text-content-muted">(optional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {ASSET_FOCUSES.map((af) => (
              <button
                key={af.value}
                type="button"
                onClick={() => setFocus(focus === af.value ? "" : af.value)}
                className={
                  "px-3 h-8 rounded-[var(--radius-pill)] border transition-colors " +
                  (focus === af.value
                    ? "bg-surface-accent-subtle border-action-primary text-action-primary"
                    : "bg-surface-base border-border-default text-content-primary hover:bg-surface-muted")
                }
                style={{ fontSize: "var(--font-size-13)", fontWeight: "var(--font-weight-medium)" }}
              >
                {af.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !username || !displayName}
          className="w-full h-10 rounded-[var(--radius-md)] flex items-center justify-center gap-2 bg-action-primary text-content-inverse hover:bg-action-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ fontSize: "var(--font-size-14)", fontWeight: "var(--font-weight-medium)" }}
        >
          {submitting ? "Setting up…" : (
            <>
              Continue <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
