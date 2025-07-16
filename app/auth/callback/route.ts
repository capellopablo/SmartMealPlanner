import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        // If there's an error, redirect to login with error
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_failed`)
      }

      // Successful OAuth authentication - redirect to dashboard
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
    } catch (error) {
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_failed`)
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
}
