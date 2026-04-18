import { NextRequest, NextResponse } from "next/server"
import { HawcxOAuth, TokenExchangeError, TokenVerificationError } from "@hawcx/oauth-client"
import { getSession } from "@/lib/session"
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

  // Upsert profile in Supabase
  let userId: string | undefined
  let isNewUser = false

  try {
    const supabase = createServiceClient()
    const { data: profile } = await supabase
      .from("profiles")
      .upsert(
        { hawcx_user_id: hawcxUserId, email },
        { onConflict: "hawcx_user_id", ignoreDuplicates: false }
      )
      .select("id, onboarding_completed")
      .single()

    if (profile) {
      userId = profile.id
      isNewUser = profile.onboarding_completed === false
    }
  } catch (err) {
    console.error("Profile upsert failed:", err)
  }

  if (!userId) {
    userId = Buffer.from(hawcxUserId).toString("base64url")
  }

  const session = await getSession()
  session.userId = userId
  session.email = email
  await session.save()

  return NextResponse.json({ ok: true, isNewUser, userId })
}
