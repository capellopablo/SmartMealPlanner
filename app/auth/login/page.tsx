"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthService } from "@/modules/auth/services/auth-service"
import type { UserCredentials } from "@/shared/types/user"

export default function LoginPage() {
  const [credentials, setCredentials] = useState<UserCredentials>({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const authService = new AuthService()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await authService.loginUser(credentials)

      if (response.success && response.token) {
        // Guardar token en localStorage (en producción usar httpOnly cookies)
        localStorage.setItem("auth_token", response.token)

        // Redirigir según si el perfil está completo
        if (response.user?.profileCompleted) {
          router.push("/dashboard")
        } else {
          router.push("/onboarding")
        }
      } else {
        setError(response.error || "Login failed")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>Sign in to your SmartMealPlanner account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={credentials.email}
                onChange={(e) => setCredentials((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">🧪 Test Credentials</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                <strong>New User (needs onboarding):</strong>
              </p>
              <p>Email: test@example.com | Password: Testing1234</p>
              <p>
                <strong>Complete User (goes to dashboard):</strong>
              </p>
              <p>Email: admin@smartmeal.com | Password: Testing1234</p>
              <p>
                <strong>Demo User:</strong>
              </p>
              <p>Email: demo@test.com | Password: Testing1234</p>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            {"Don't have an account? "}
            <Link href="/auth/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
