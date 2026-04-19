import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getPost, softDeletePost } from "@/lib/posts/queries"
import { stitchLivePrices } from "@/lib/posts/hydrate"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const { id } = await params
  const post = await getPost(session.userId, id)
  if (!post) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }
  const [hydrated] = await stitchLivePrices([post])
  return NextResponse.json({ post: hydrated })
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }
  const { id } = await params
  const ok = await softDeletePost(id, session.userId)
  if (!ok) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }
  return NextResponse.json({ ok: true })
}
