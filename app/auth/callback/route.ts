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
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        // If there's an error, redirect to login with error
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_failed`)
      }

      // Check if this is a new user (first time OAuth login)
      const isNewUser = data.user && !data.user.email_confirmed_at

      if (isNewUser) {
        // Redirect to login with success message for new OAuth users
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?success=account_created`)
      } else {
        // Existing user, redirect to dashboard
        return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
      }
    } catch (error) {
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth_failed`)
    }
  }

  // No code provided, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
}
