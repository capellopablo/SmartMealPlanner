"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { UserProfileBuilder } from "@/modules/auth/services/user-profile-builder"
import { AuthService } from "@/modules/auth/services/auth-service"
import type { OnboardingData } from "@/modules/auth/services/user-profile-builder"
import type { User } from "@/shared/types/user"

// Componentes para cada paso del onboarding
import PersonalInfoStep from "@/components/onboarding/personal-info-step"
import GoalsStep from "@/components/onboarding/goals-step"
import PreferencesStep from "@/components/onboarding/preferences-step"
import RestrictionsStep from "@/components/onboarding/restrictions-step"
import FoodPreferencesStep from "@/components/onboarding/food-preferences-step"
import CaloriesStep from "@/components/onboarding/calories-step"

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [user, setUser] = useState<User | null>(null)
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const profileBuilder = new UserProfileBuilder()
  const authService = new AuthService()
  const totalSteps = 6

  useEffect(() => {
    // Verificar autenticación
    const checkAuth = async () => {
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

      if (currentUser.profileCompleted) {
        router.push("/dashboard")
        return
      }

      setUser(currentUser)
    }

    checkAuth()
  }, [])

  const handleStepComplete = (stepData: any) => {
    console.log("Step completed with data:", stepData)

    setOnboardingData((prev) => {
      const newData = { ...prev, ...stepData }
      console.log("Updated onboarding data:", newData)
      return newData
    })

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1)
    } else {
      // For the final step, call completion immediately with the merged data
      handleOnboardingComplete({ ...onboardingData, ...stepData })
    }
  }

  const handleOnboardingComplete = async (finalStepData?: any) => {
    if (!user) {
      setError("User not found")
      return
    }

    // Use provided data or current state
    const finalData = finalStepData || { ...onboardingData }
    console.log("Final onboarding data:", finalData)

    // Validate that we have all required data
    if (
      !finalData.personalInfo ||
      !finalData.goals ||
      !finalData.preferences ||
      !finalData.restrictions ||
      !finalData.foodPreferences ||
      !finalData.calories
    ) {
      setError("Missing required onboarding data. Please complete all steps.")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const profile = await profileBuilder.createProfile(user.id, finalData as OnboardingData)

      if (profile) {
        router.push("/dashboard")
      } else {
        setError("Failed to create profile. Please try again.")
      }
    } catch (error) {
      console.error("Onboarding error:", error)
      setError("An error occurred while creating your profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep onComplete={handleStepComplete} />
      case 2:
        return <GoalsStep onComplete={handleStepComplete} />
      case 3:
        return <PreferencesStep onComplete={handleStepComplete} />
      case 4:
        return <RestrictionsStep onComplete={handleStepComplete} />
      case 5:
        return <FoodPreferencesStep onComplete={handleStepComplete} />
      case 6:
        return <CaloriesStep onComplete={handleStepComplete} />
      default:
        return null
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome to SmartMealPlanner, {user.name}!</CardTitle>
            <CardDescription>Let's set up your profile to create personalized meal plans</CardDescription>
            <div className="mt-4">
              <Progress value={(currentStep / totalSteps) * 100} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {renderCurrentStep()}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || isLoading}>
                Previous
              </Button>

              {isLoading && (
                <Button disabled className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Completing setup...
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
