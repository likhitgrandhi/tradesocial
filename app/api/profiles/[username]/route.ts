import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getProfileByUsername, isFollowing } from "@/lib/profiles/queries"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const { username } = await params
  const profile = await getProfileByUsername(username)
  if (!profile) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }
  const isSelf = profile.id === session.userId
  const following = isSelf ? false : await isFollowing(session.userId, profile.id)
  return NextResponse.json({
    profile,
    viewer: { isSelf, isFollowing: following },
  })
}
