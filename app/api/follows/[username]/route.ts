import { NextResponse } from "next/server"

import { getSession } from "@/lib/session"
import { getProfileByUsername, follow, unfollow } from "@/lib/profiles/queries"
import { checkRateLimit } from "@/lib/rate-limit"

export const runtime = "nodejs"

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const limit = checkRateLimit(`follow:${session.userId}`, 30, 60_000)
  if (!limit.ok) {
    return NextResponse.json(
      { error: "rate_limited", retryAfterMs: limit.retryAfterMs },
      { status: 429 }
    )
  }

  const { username } = await params
  const target = await getProfileByUsername(username)
  if (!target) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }
  if (target.id === session.userId) {
    return NextResponse.json({ error: "cannot_follow_self" }, { status: 400 })
  }

  try {
    await follow(session.userId, target.id)
    return NextResponse.json({ following: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "follow_failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { username } = await params
  const target = await getProfileByUsername(username)
  if (!target) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }
  try {
    await unfollow(session.userId, target.id)
    return NextResponse.json({ following: false })
  } catch (err) {
    const message = err instanceof Error ? err.message : "unfollow_failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
