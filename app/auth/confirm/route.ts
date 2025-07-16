import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get("token_hash")
  const type = requestUrl.searchParams.get("type")

  if (token_hash && type) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash,
        type: type as any,
      })

      if (error) {
        // If there's an error, redirect to login with error
        return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=verification_failed`)
      }

      // Email confirmed successfully, redirect to login with success message
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?success=email_confirmed`)
    } catch (error) {
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=verification_failed`)
    }
  }

  // No token provided, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/auth/login`)
}
