"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getSupabaseClient } from "@/lib/supabase"
import { Lock } from "lucide-react"

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isValidSession, setIsValidSession] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error || !session) {
          setError("Invalid or expired reset link. Please request a new password reset.")
          return
        }

        // Check if this is a recovery session
        if (session.user && session.access_token) {
          setIsValidSession(true)
        } else {
          setError("Invalid reset session. Please request a new password reset.")
        }
      } catch (error: any) {
        setError("Failed to validate reset session. Please try again.")
      }
    }

    checkSession()
  }, [supabase.auth])

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    // Validate password length
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        throw error
      }

      // Sign out the user after successful password update
      await supabase.auth.signOut()

      // Redirect to login with success message
      router.push("/auth/login?success=password_updated")
    } catch (error: any) {
      let errorMessage = "Failed to update password. Please try again."

      // Handle specific Supabase errors
      if (error.message) {
        if (error.message.includes("Password should be at least")) {
          errorMessage = "Password must be at least 6 characters long."
        } else if (error.message.includes("Unable to validate email address")) {
          errorMessage = "Invalid or expired reset link. Please request a new password reset."
        } else if (error.message.includes("Password should contain")) {
          errorMessage = "Password does not meet security requirements."
        } else {
          errorMessage = error.message
        }
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (!isValidSession && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div>Validating reset link...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Update Password</CardTitle>
          <CardDescription>Enter your new password below</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isValidSession && (
            <>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <p className="text-sm text-blue-800">
                  You can now set a new password for your account. Make sure to choose a strong password that you
                  haven't used before.
                </p>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  <Lock className="w-4 h-4 mr-2" />
                  {loading ? "Updating Password..." : "Update Password"}
                </Button>
              </form>
            </>
          )}

          {error && !isValidSession && (
            <div className="text-center">
              <Button onClick={() => router.push("/auth/reset-password")} variant="outline">
                Request New Reset Link
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
