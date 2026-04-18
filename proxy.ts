import { NextResponse, type NextRequest } from "next/server"
import { unsealData } from "iron-session"
import type { SessionData } from "@/lib/session"

export const runtime = "nodejs"

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "ts_session"
const SESSION_SECRET = process.env.SESSION_SECRET ?? ""

const PUBLIC_PREFIXES = ["/login", "/signup", "/auth", "/api/auth", "/terms", "/privacy", "/onboarding"]

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup")

  const sealed = request.cookies.get(SESSION_COOKIE)?.value
  let userId: string | undefined

  if (sealed) {
    try {
      const session = await unsealData<SessionData>(sealed, { password: SESSION_SECRET })
      userId = session.userId
    } catch {
      // Invalid or expired cookie
    }
  }

  if (!userId && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  if (userId && isAuthPage) {
    return NextResponse.redirect(new URL("/feed", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
