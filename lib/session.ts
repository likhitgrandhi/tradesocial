import { getIronSession, type IronSession } from "iron-session"
import { cookies } from "next/headers"

export interface SessionData {
  userId: string
  email: string
}

const secret = process.env.SESSION_SECRET
if (!secret) throw new Error("SESSION_SECRET env var is not set")

export const sessionOptions = {
  cookieName: process.env.SESSION_COOKIE_NAME ?? "ts_session",
  password: secret,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  },
}

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies()
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions)
  // Self-heal stale cookies from a prior deploy that stored the Hawcx `sub`
  // (base64 of email) in userId instead of the profile UUID. Without this,
  // every downstream query .eq("id", session.userId) fails with Postgres 22P02.
  // We mask the fields in memory only — destroy() would write a cookie, which
  // isn't allowed during RSC rendering. The stale cookie is overwritten the
  // next time /api/auth/session runs (login) or /api/auth/logout is called.
  if (session.userId && !UUID_RE.test(session.userId)) {
    session.userId = ""
    session.email = ""
  }
  return session
}
