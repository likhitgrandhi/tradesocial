import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Handles both magic-link clicks and OAuth redirects from Supabase Auth.
// After code exchange, checks whether the user has completed onboarding
// (username set) and routes them accordingly.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/feed"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, onboarding_completed")
          .eq("id", user.id)
          .single()

        // New user: profile exists (created by trigger) but onboarding not done
        // TODO: redirect to /onboarding once that page is built
        if (profile?.onboarding_completed === false) {
          return NextResponse.redirect(`${origin}/feed`)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
