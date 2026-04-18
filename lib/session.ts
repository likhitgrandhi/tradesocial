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

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}
