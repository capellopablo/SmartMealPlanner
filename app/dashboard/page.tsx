"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AuthService } from "@/modules/auth/services/auth-service"
import { UserProfileBuilder } from "@/modules/auth/services/user-profile-builder"
import { MenuGeneratorService } from "@/modules/menu-generator/services/menu-generator-service"
import type { User, UserProfile } from "@/shared/types/user"
import type { WeeklyMenu } from "@/shared/types/menu"
import { Plus, Calendar, Clock, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [activeMenus, setActiveMenus] = useState<WeeklyMenu[]>([])
  const [completedMenus, setCompletedMenus] = useState<WeeklyMenu[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState<string | null>(null)
  const router = useRouter()

  const authService = new AuthService()
  const profileBuilder = new UserProfileBuilder()
  const menuService = new MenuGeneratorService()

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        router.push("/auth/login")
        return
      }

      const currentUser = await authService.getCurrentUser(token)
      if (!currentUser) {
        router.push("/auth/login")
        return
      }

      if (!currentUser.profileCompleted) {
        router.push("/onboarding")
        return
      }

      const userProfile = await profileBuilder.getProfile(currentUser.id)
      const userMenus = await menuService.getUserMenus(currentUser.id)

      setUser(currentUser)
      setProfile(userProfile)
      setActiveMenus(userMenus.filter((m) => m.status === "active" || m.status === "pending"))
      setCompletedMenus(userMenus.filter((m) => m.status === "completed").slice(0, 10))
      setIsLoading(false)
    }

    loadUserData()

    // Check for success notification
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get("success") === "menu_created") {
      setNotification("Menu created successfully!")
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname)
      // Clear notification after 5 seconds
      setTimeout(() => setNotification(null), 5000)
    }
  }, [])

  const handleLogout = async () => {
    const token = localStorage.getItem("auth_token")
    if (token) {
      await authService.logoutUser(token)
      localStorage.removeItem("auth_token")
    }
    router.push("/auth/login")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800">Completed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading user data</p>
          <Button onClick={() => router.push("/auth/login")} className="mt-4">
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  const recommendedCalories = profileBuilder.getRecommendedCalories(profile)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Notification */}
      {notification && (
        <div className="bg-green-500 text-white px-4 py-3 text-center">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5" />
            {notification}
          </div>
        </div>
      )}

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">SmartMealPlanner</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{profile.maxDailyCalories || recommendedCalories}</div>
              <p className="text-xs text-gray-600">{profile.maxDailyCalories ? "Custom limit" : "Recommended"}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Menus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeMenus.length}</div>
              <p className="text-xs text-gray-600">Currently active</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Diet Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold capitalize">{profile.dietType}</div>
              <p className="text-xs text-gray-600">Your preference</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold capitalize">{profile.goal.replace("_", " ")}</div>
              <p className="text-xs text-gray-600">Current objective</p>
            </CardContent>
          </Card>
        </div>

        {/* Create New Menu Button */}
        <div className="mb-8">
          <Button className="flex items-center gap-2" onClick={() => router.push("/menu/create")}>
            <Plus className="h-4 w-4" />
            Create New Menu
          </Button>
        </div>

        {/* Active and Pending Menus */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Active & Pending Menus
            </CardTitle>
            <CardDescription>Menus currently in use or scheduled for future days.</CardDescription>
          </CardHeader>
          <CardContent>
            {activeMenus.length === 0 ? (
              <p className="text-gray-500 text-center py-8">You have no active menus. Create your first one!</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Meals/Day</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeMenus.map((menu) => (
                    <TableRow key={menu.id}>
                      <TableCell className="font-medium">{menu.name}</TableCell>
                      <TableCell>{menu.startDate.toLocaleDateString()}</TableCell>
                      <TableCell>{menu.totalDays}</TableCell>
                      <TableCell>{getStatusBadge(menu.status)}</TableCell>
                      <TableCell>{menu.mealsPerDay.length}</TableCell>
                      <TableCell>
                        <Link href={`/menu/${menu.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Completed Menus */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Completed Menus
            </CardTitle>
            <CardDescription>A history of your past meal plans.</CardDescription>
          </CardHeader>
          <CardContent>
            {completedMenus.length === 0 ? (
              <p className="text-gray-500 text-center py-8">You haven't completed any menus yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedMenus.map((menu) => (
                    <TableRow key={menu.id}>
                      <TableCell className="font-medium">{menu.name}</TableCell>
                      <TableCell>{menu.endDate?.toLocaleDateString() || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(menu.status)}</TableCell>
                      <TableCell>
                        <Link href={`/menu/${menu.id}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
