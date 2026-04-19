import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { onboardingSchema } from "@/lib/profiles/schema"
import { validateUsername } from "@/lib/profiles/username"
import { claimUsername, getProfileById } from "@/lib/profiles/queries"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 })
  }

  const parsed = onboardingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const check = validateUsername(parsed.data.username)
  if (!check.ok) {
    return NextResponse.json({ error: "invalid_username", message: check.reason }, { status: 400 })
  }

  // Idempotent: if already onboarded, return current profile.
  const existing = await getProfileById(session.userId)
  if (existing?.onboarding_completed && existing.username) {
    return NextResponse.json({ profile: existing })
  }

  try {
    const profile = await claimUsername(
      session.userId,
      check.normalized,
      parsed.data.display_name,
      parsed.data.asset_focus
    )
    return NextResponse.json({ profile })
  } catch (err) {
    const e = err as { code?: string; message?: string }
    if (e.code === "23505") {
      return NextResponse.json({ error: "username_taken" }, { status: 409 })
    }
    if (e.code === "23514") {
      return NextResponse.json({ error: "invalid_username" }, { status: 400 })
    }
    return NextResponse.json({ error: e.message ?? "claim_failed" }, { status: 500 })
  }
}
