"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { AuthService } from "@/modules/auth/services/auth-service"
import { MenuGeneratorService } from "@/modules/menu-generator/services/menu-generator-service"
import type { User, UserProfile } from "@/shared/types/user"
import type { MealType, MenuGenerationRequest } from "@/shared/types/menu"
import { ArrowLeft } from "lucide-react"
import { UserProfileBuilder } from "@/modules/auth/services/user-profile-builder"

const basePrompt = `Quiero que generes un plan de comidas personalizado para un usuario con las siguientes características de perfil y requerimientos de menú. Tu respuesta debe seguir una estructura estricta en formato JSON, como se indica más abajo.

---

### Datos del usuario:
- Objetivo: [GOAL]
- Tipo de dieta: [DIET_TYPE]
- Restricciones alimenticias: [FOOD_RESTRICTIONS]
- Exclusiones personales (ingredientes que NO deben aparecer en ninguna receta): [INGREDIENT_EXCLUSIONS]
- Cantidad de porciones por comida: [SERVINGS]

---

### Parámetros del menú a generar:
- Duración del menú: [TOTAL_DAYS días]
- Comidas por día: [MEALS_PER_DAY]
- Calorías máximas por día: [MAX_CALORIES]

---

### Instrucciones para la generación:

1. Todas las recetas deben cumplir con las restricciones alimenticias indicadas.
2. No incluyas ninguno de los ingredientes de la lista de exclusiones.
3. El total de calorías de las comidas de cada día no debe superar el máximo de calorías diarias.
4. Genera nombres de recetas creativos y apetitosos.
5. Proporciona instrucciones claras y fáciles de seguir.
6. La lista de ingredientes debe ser precisa.`

export default function CreateMenuPage() {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split("T")[0], // Today's date
    days: 7,
    maxCaloriesPerDay: 2000,
    servings: 1,
  })

  const [selectedMeals, setSelectedMeals] = useState<MealType[]>(["breakfast", "lunch", "dinner"])

  const authService = new AuthService()
  const profileBuilder = new UserProfileBuilder()
  const menuService = new MenuGeneratorService()

  const mealOptions = [
    { value: "breakfast" as MealType, label: "Breakfast" },
    { value: "lunch" as MealType, label: "Lunch" },
    { value: "snack" as MealType, label: "Snack" },
    { value: "dinner" as MealType, label: "Dinner" },
  ]

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token")
        if (!token) {
          router.push("/auth/login")
          return
        }

        const currentUser = await authService.getCurrentUser(token)
        if (!currentUser) {
          localStorage.removeItem("auth_token")
          router.push("/auth/login")
          return
        }

        if (!currentUser.profileCompleted) {
          router.push("/onboarding")
          return
        }
        
        const profile = await profileBuilder.getProfile(currentUser.id)

        setUser(currentUser)
        setUserProfile(profile)
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/auth/login")
      } finally {
        setIsAuthLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleMealToggle = (mealType: MealType, checked: boolean) => {
    if (checked) {
      setSelectedMeals((prev) => [...prev, mealType])
    } else {
      setSelectedMeals((prev) => prev.filter((meal) => meal !== mealType))
    }
  }

  const generatePrompt = () => {
    if (!userProfile) return null

    let prompt = basePrompt
    prompt = prompt.replace('[GOAL]', userProfile.goal || 'No especificado')
    prompt = prompt.replace('[DIET_TYPE]', userProfile.dietType || 'Omnívora')
    prompt = prompt.replace('[FOOD_RESTRICTIONS]', userProfile.restrictions.join(', ') || 'Ninguna')
    prompt = prompt.replace('[INGREDIENT_EXCLUSIONS]', userProfile.dislikedIngredients.join(', ') || 'Ninguna')
    prompt = prompt.replace('[SERVINGS]', formData.servings.toString())
    prompt = prompt.replace('[TOTAL_DAYS]', formData.days.toString())
    prompt = prompt.replace('[MEALS_PER_DAY]', selectedMeals.join(', '))
    prompt = prompt.replace('[MAX_CALORIES]', formData.maxCaloriesPerDay.toString())

    return prompt
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      // Validation
      if (selectedMeals.length === 0) {
        setError("You must select at least one meal per day.")
        return
      }

      if (formData.days < 1 || formData.days > 30) {
        setError("Days must be between 1 and 30.")
        return
      }

      if (formData.maxCaloriesPerDay < 800 || formData.maxCaloriesPerDay > 5000) {
        setError("Daily calories must be between 800 and 5000.")
        return
      }

      if (formData.servings < 1 || formData.servings > 10) {
        setError("Servings must be between 1 and 10.")
        return
      }

      const finalPrompt = generatePrompt()
      console.log('--- GENERATED PROMPT ---')
      console.log(finalPrompt)
      console.log('------------------------')

      const request: MenuGenerationRequest = {
        startDate: new Date(formData.startDate),
        days: formData.days,
        mealsPerDay: selectedMeals,
        maxCaloriesPerDay: formData.maxCaloriesPerDay,
        servings: formData.servings,
      }

      const menu = await menuService.generateMenu(user.id, request)
      router.push(`/menu/${menu.id}?success=menu_created`)
    } catch (error) {
      console.error("Error creating menu:", error)
      setError("Failed to create menu. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthLoading || !user) {
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
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Create New Menu</CardTitle>
            <CardDescription>Configure your custom menu based on your preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="days">Number of Days</Label>
                  <Input
                    id="days"
                    type="number"
                    min="1"
                    max="30"
                    value={formData.days}
                    onChange={(e) => setFormData((prev) => ({ ...prev, days: Number.parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label className="text-base font-medium">Meals per Day</Label>
                <p className="text-sm text-gray-600 mb-3">Select the meals you want to include in your menu.</p>
                <div className="grid grid-cols-2 gap-3">
                  {mealOptions.map((meal) => (
                    <div key={meal.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={meal.value}
                        checked={selectedMeals.includes(meal.value)}
                        onCheckedChange={(checked) => handleMealToggle(meal.value, checked as boolean)}
                      />
                      <Label htmlFor={meal.value} className="text-sm cursor-pointer">
                        {meal.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxCalories">Max Calories per Day</Label>
                  <Input
                    id="maxCalories"
                    type="number"
                    min="800"
                    max="5000"
                    value={formData.maxCaloriesPerDay}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, maxCaloriesPerDay: Number.parseInt(e.target.value) }))
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="servings">Servings per Meal</Label>
                  <Input
                    id="servings"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.servings}
                    onChange={(e) => setFormData((prev) => ({ ...prev, servings: Number.parseInt(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="font-medium text-blue-900 mb-2">📋 Summary</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• {formData.days}-day menu</p>
                  <p>• {selectedMeals.length} meals per day</p>
                  <p>• Max {formData.maxCaloriesPerDay} calories per day</p>
                  <p>• {formData.servings} serving(s) per meal</p>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Generating Menu..." : "Create Menu"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
