import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getProfileById } from "@/lib/profiles/queries"

export const runtime = "nodejs"

export async function GET() {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json(null, { status: 401 })
  }

  const profile = await getProfileById(session.userId)
  if (!profile) {
    return NextResponse.json(null, { status: 401 })
  }

  return NextResponse.json({
    userId: session.userId,
    email: session.email,
    username: profile.username,
    display_name: profile.display_name,
    avatar_url: profile.avatar_url,
    onboarding_completed: profile.onboarding_completed,
  })
}
