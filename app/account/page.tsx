"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getSupabaseClient } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import { ArrowLeft, UserIcon, Shield, Settings, Chrome, Facebook, Mail } from "lucide-react"

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = getSupabaseClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)

      if (!user) {
        router.push("/auth/login")
      }
    }

    getUser()
  }, [router, supabase.auth])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordLoading(true)
    setError("")
    setMessage("")

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      setPasswordLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      setPasswordLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setMessage("Password updated successfully!")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      setError(error.message)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setError("")

    try {
      // Get the current session to include the access token
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.access_token) {
        throw new Error("No valid session found")
      }

      const response = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete account")
      }

      await supabase.auth.signOut()
      router.push("/")
    } catch (error: any) {
      setError(error.message)
      setDeleteLoading(false)
    }
  }

  const getAuthProvider = () => {
    if (!user?.app_metadata?.providers) return "email"
    const providers = user.app_metadata.providers
    if (providers.includes("google")) return "google"
    if (providers.includes("facebook")) return "facebook"
    return "email"
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return <Chrome className="w-4 h-4" />
      case "facebook":
        return <Facebook className="w-4 h-4" />
      default:
        return <Mail className="w-4 h-4" />
    }
  }

  const getProviderName = (provider: string) => {
    switch (provider) {
      case "google":
        return "Google"
      case "facebook":
        return "Meta (Facebook)"
      default:
        return "Email"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const authProvider = getAuthProvider()
  const isEmailAuth = authProvider === "email"

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mr-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold">My Account</h1>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="profile" orientation="vertical" className="flex gap-8">
          <TabsList className="flex flex-col h-fit w-48 bg-white">
            <TabsTrigger value="profile" className="w-full justify-start">
              <UserIcon className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="authentication" className="w-full justify-start">
              <Shield className="w-4 h-4 mr-2" />
              Authentication
            </TabsTrigger>
            <TabsTrigger value="advanced" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Advanced
            </TabsTrigger>
          </TabsList>

          <div className="flex-1">
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Email</Label>
                    <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">User ID</Label>
                    <p className="mt-1 text-sm text-gray-500 font-mono">{user.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Account Created</Label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="authentication">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {message && (
                    <Alert className="border-green-200 bg-green-50">
                      <AlertDescription className="text-green-800">{message}</AlertDescription>
                    </Alert>
                  )}

                  <div>
                    <Label className="text-sm font-medium text-gray-700">Authentication Method</Label>
                    <div className="mt-2 flex items-center space-x-2">
                      {getProviderIcon(authProvider)}
                      <span className="text-sm text-gray-900">{getProviderName(authProvider)}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {isEmailAuth
                        ? "Signed in with email and password"
                        : `Signed in with ${getProviderName(authProvider)}`}
                    </p>
                  </div>

                  {isEmailAuth ? (
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                      <div>
                        <Label htmlFor="current-email">Current Email</Label>
                        <Input id="current-email" type="email" value={user.email || ""} disabled />
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input
                          id="new-password"
                          type="password"
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          minLength={6}
                        />
                      </div>
                      <Button type="submit" disabled={passwordLoading}>
                        {passwordLoading ? "Updating..." : "Update Password"}
                      </Button>
                    </form>
                  ) : (
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <p className="text-sm text-blue-800">
                        Your account is managed by {getProviderName(authProvider)}. Password changes must be done
                        through your {getProviderName(authProvider)} account settings.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="border border-red-200 rounded-md p-4 bg-red-50">
                    <h3 className="text-lg font-medium text-red-800 mb-2">Delete Account</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <Button variant="destructive" onClick={() => setShowDeleteModal(true)}>
                      Delete My Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              Are you absolutely sure you want to delete your account? This action cannot be undone. This will
              permanently delete your account and remove all of your data from our servers.
            </DialogDescription>
          </DialogHeader>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={deleteLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteLoading}>
              {deleteLoading ? "Deleting..." : "Delete Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
