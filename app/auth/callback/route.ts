import { NextResponse } from "next/server"

// Deprecated: Supabase OAuth callback. Auth is now handled by Hawcx.
export async function GET(request: Request) {
  const { origin } = new URL(request.url)
  return NextResponse.redirect(`${origin}/login`)
}
