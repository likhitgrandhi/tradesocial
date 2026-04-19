import { NextResponse } from "next/server"

import { getSession } from "@/lib/session"
import { deleteTrade } from "@/lib/trades/queries"

export const runtime = "nodejs"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session.userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { id } = await params
  try {
    const ok = await deleteTrade(id, session.userId)
    if (!ok) {
      return NextResponse.json({ error: "not_found" }, { status: 404 })
    }
    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : "delete_failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
