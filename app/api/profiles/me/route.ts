import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getProfileById, updateProfile } from "@/lib/profiles/queries"
import { updateProfileSchema } from "@/lib/profiles/schema"

export const runtime = "nodejs"

export async function GET() {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const profile = await getProfileById(session.userId)
  if (!profile) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }
  return NextResponse.json({ profile })
}

export async function PATCH(request: Request) {
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
  const parsed = updateProfileSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", issues: parsed.error.flatten() },
      { status: 400 }
    )
  }
  const profile = await updateProfile(session.userId, parsed.data)
  return NextResponse.json({ profile })
}
