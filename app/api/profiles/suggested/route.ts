import { NextResponse } from "next/server"

import { getSession } from "@/lib/session"
import { listSuggestedProfiles } from "@/lib/profiles/queries"

export const runtime = "nodejs"

export async function GET() {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const profiles = await listSuggestedProfiles(5)
  return NextResponse.json({
    profiles: profiles.filter((p) => p.id !== session.userId),
  })
}
