import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

// Routes that don't require authentication
const PUBLIC_PREFIXES = ["/login", "/signup", "/auth", "/terms", "/privacy", "/onboarding"]

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  // Create a Supabase client that can read/write cookies via the response
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Refresh the session — IMPORTANT: do not add any logic between createServerClient
  // and getUser(), otherwise sessions may not refresh correctly.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isPublic = PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup")

  // Unauthenticated user hitting a protected route → send to login
  if (!user && !isPublic) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  // Authenticated user hitting login/signup → send to feed
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/feed", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Match all routes except Next.js internals and static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
