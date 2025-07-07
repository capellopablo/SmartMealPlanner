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
import type { User } from "@/shared/types/user"
import type { MealType, MenuGenerationRequest } from "@/shared/types/menu"
import { ArrowLeft } from "lucide-react"

export default function CreateMenuPage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split("T")[0], // Today's date
    days: 7,
    maxCaloriesPerDay: 2000,
    servings: 1,
  })

  const [selectedMeals, setSelectedMeals] = useState<MealType[]>(["breakfast", "lunch", "dinner"])

  const authService = new AuthService()
  const menuService = new MenuGeneratorService()

  const mealOptions = [
    { value: "breakfast" as MealType, label: "Desayuno" },
    { value: "lunch" as MealType, label: "Almuerzo" },
    { value: "snack" as MealType, label: "Merienda" },
    { value: "dinner" as MealType, label: "Cena" },
  ]

  useEffect(() => {
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

      if (!currentUser.profileCompleted) {
        router.push("/onboarding")
        return
      }

      setUser(currentUser)
    }

    checkAuth()
  }, [])

  const handleMealToggle = (mealType: MealType, checked: boolean) => {
    if (checked) {
      setSelectedMeals((prev) => [...prev, mealType])
    } else {
      setSelectedMeals((prev) => prev.filter((meal) => meal !== mealType))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      // Validation
      if (selectedMeals.length === 0) {
        setError("Debes seleccionar al menos una comida por día")
        return
      }

      if (formData.days < 1 || formData.days > 30) {
        setError("Los días deben estar entre 1 y 30")
        return
      }

      if (formData.maxCaloriesPerDay < 800 || formData.maxCaloriesPerDay > 5000) {
        setError("Las calorías diarias deben estar entre 800 y 5000")
        return
      }

      if (formData.servings < 1 || formData.servings > 10) {
        setError("Las porciones deben estar entre 1 y 10")
        return
      }

      const request: MenuGenerationRequest = {
        startDate: new Date(formData.startDate),
        days: formData.days,
        mealsPerDay: selectedMeals,
        maxCaloriesPerDay: formData.maxCaloriesPerDay,
        servings: formData.servings,
      }

      const menu = await menuService.generateMenu(user.id, request)
      router.push(`/menu/${menu.id}`)
    } catch (error) {
      console.error("Error creating menu:", error)
      setError("Error al crear el menú. Por favor intenta de nuevo.")
    } finally {
      setIsLoading(false)
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
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Crear Nuevo Menú</CardTitle>
            <CardDescription>Configura tu menú personalizado según tus preferencias</CardDescription>
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
                  <Label htmlFor="startDate">Fecha de Inicio</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="days">Número de Días</Label>
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
                <Label className="text-base font-medium">Comidas por Día</Label>
                <p className="text-sm text-gray-600 mb-3">Selecciona las comidas que quieres incluir en tu menú</p>
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
                  <Label htmlFor="maxCalories">Calorías Máximas por Día</Label>
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
                  <Label htmlFor="servings">Porciones por Comida</Label>
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
                <h4 className="font-medium text-blue-900 mb-2">📋 Resumen</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Menú de {formData.days} días</p>
                  <p>• {selectedMeals.length} comidas por día</p>
                  <p>• Máximo {formData.maxCaloriesPerDay} calorías diarias</p>
                  <p>• {formData.servings} porción(es) por comida</p>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Generando menú..." : "Generar Menú"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
