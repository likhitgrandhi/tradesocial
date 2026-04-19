import { NextRequest, NextResponse } from "next/server"
import { HawcxOAuth, TokenExchangeError, TokenVerificationError } from "@hawcx/oauth-client"
import { getSession, UUID_RE } from "@/lib/session"
import { createServiceClient } from "@/lib/supabase/service"

// HawcxOAuth uses its own base URL (https://api.hawcx.com) for /oauth2/token —
// do not pass the /v1 auth API URL here
const oauth = new HawcxOAuth({
  configId: process.env.NEXT_PUBLIC_HAWCX_CONFIG_ID!,
})

export async function POST(req: NextRequest) {
  const { authCode, codeVerifier } = await req.json()

  if (!authCode) {
    return NextResponse.json({ error: "Missing authCode" }, { status: 400 })
  }

  // Verify the authCode with Hawcx — this is single-use and expires in 60s
let claims: { sub?: string; email?: string }
  try {
    const result = await oauth.exchangeCode(authCode, codeVerifier ?? "")
    claims = result.claims
  } catch (err) {
    console.error("[auth/session] exchangeCode failed:", err)
    if (err instanceof TokenExchangeError || err instanceof TokenVerificationError) {
      return NextResponse.json({ error: "Authentication verification failed" }, { status: 401 })
    }
    throw err
  }

  const hawcxUserId = claims.sub ?? authCode
  const email = claims.email ?? ""

  // Upsert profile in Supabase — the returned profile.id is the UUID we use
  // as session.userId everywhere else (trades.user_id FK, etc.). We must not
  // fall back to a non-UUID value here: downstream writes will fail.
  let userId: string
  let isNewUser = false

  try {
    const supabase = createServiceClient()
    const { data: profile, error } = await supabase
      .from("profiles")
      .upsert(
        { hawcx_user_id: hawcxUserId, email },
        { onConflict: "hawcx_user_id", ignoreDuplicates: false }
      )
      .select("id, onboarding_completed")
      .single()

    if (error || !profile) {
      console.error("[auth/session] Profile upsert failed:", error)
      return NextResponse.json({ error: "Profile provisioning failed" }, { status: 500 })
    }

    if (!UUID_RE.test(profile.id)) {
      console.error("[auth/session] Profile upsert returned non-UUID id:", profile.id)
      return NextResponse.json({ error: "Profile provisioning failed" }, { status: 500 })
    }

    userId = profile.id
    isNewUser = profile.onboarding_completed === false
  } catch (err) {
    console.error("[auth/session] Profile upsert threw:", err)
    return NextResponse.json({ error: "Profile provisioning failed" }, { status: 500 })
  }

  const session = await getSession()
  session.userId = userId
  session.email = email
  await session.save()

  return NextResponse.json({ ok: true, isNewUser, userId })
}
