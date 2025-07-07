"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { AuthService } from "@/modules/auth/services/auth-service"
import { MenuGeneratorService } from "@/modules/menu-generator/services/menu-generator-service"
import type { User } from "@/shared/types/user"
import type { WeeklyMenu } from "@/shared/types/menu"
import { ArrowLeft, ChevronDown, ChevronRight, Clock, Users } from "lucide-react"

export default function MenuViewPage() {
  const [user, setUser] = useState<User | null>(null)
  const [menu, setMenu] = useState<WeeklyMenu | null>(null)
  const [selectedMealIds, setSelectedMealIds] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [isConfirming, setIsConfirming] = useState(false)
  const router = useRouter()
  const params = useParams()

  const authService = new AuthService()
  const menuService = new MenuGeneratorService()

  useEffect(() => {
    const loadData = async () => {
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

      const menuId = params.id as string
      const menuData = await menuService.getMenuById(menuId)

      if (!menuData || menuData.userId !== currentUser.id) {
        router.push("/dashboard")
        return
      }

      setUser(currentUser)
      setMenu(menuData)
      setIsLoading(false)
    }

    loadData()
  }, [params.id])

  const toggleDayExpansion = (dayIndex: number) => {
    if (!menu) return

    const updatedMenu = { ...menu }
    updatedMenu.days[dayIndex].expanded = !updatedMenu.days[dayIndex].expanded
    setMenu(updatedMenu)
  }

  const toggleMealSelection = (mealId: string, checked: boolean) => {
    if (checked) {
      setSelectedMealIds((prev) => [...prev, mealId])
    } else {
      setSelectedMealIds((prev) => prev.filter((id) => id !== mealId))
    }
  }

  const handleRegenerateSelected = async () => {
    if (!menu || selectedMealIds.length === 0) return

    setIsRegenerating(true)
    try {
      const updatedMenu = await menuService.regenerateSelectedMeals(menu.id, selectedMealIds)
      if (updatedMenu) {
        setMenu(updatedMenu)
        setSelectedMealIds([])
      }
    } catch (error) {
      console.error("Error regenerating meals:", error)
    } finally {
      setIsRegenerating(false)
    }
  }

  const handleConfirmMenu = async () => {
    if (!menu) return

    setIsConfirming(true)
    try {
      await menuService.confirmMenu(menu.id)
      router.push("/dashboard?success=menu_created")
    } catch (error) {
      console.error("Error confirming menu:", error)
    } finally {
      setIsConfirming(false)
    }
  }

  const getMealTypeLabel = (mealType: string) => {
    const labels: Record<string, string> = {
      breakfast: "Desayuno",
      lunch: "Almuerzo",
      snack: "Merienda",
      dinner: "Cena",
    }
    return labels[mealType] || mealType
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Cargando menú...</p>
        </div>
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Menú no encontrado</p>
          <Button onClick={() => router.push("/dashboard")} className="mt-4">
            Volver al Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Dashboard
          </Button>
        </div>

        {/* Menu Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{menu.name}</CardTitle>
                <CardDescription>
                  {menu.startDate.toLocaleDateString()} - {menu.endDate.toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge
                className={menu.status === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
              >
                {menu.status === "active" ? "Activo" : "Pendiente"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="font-medium">Días totales</p>
                <p className="text-gray-600">{menu.totalDays}</p>
              </div>
              <div>
                <p className="font-medium">Comidas por día</p>
                <p className="text-gray-600">{menu.mealsPerDay.length}</p>
              </div>
              <div>
                <p className="font-medium">Calorías máximas</p>
                <p className="text-gray-600">{menu.maxCaloriesPerDay}/día</p>
              </div>
              <div>
                <p className="font-medium">Porciones</p>
                <p className="text-gray-600">{menu.servingsPerMeal} por comida</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Days */}
        <div className="space-y-4 mb-6">
          {menu.days.map((day, dayIndex) => (
            <Card key={dayIndex}>
              <CardHeader className="cursor-pointer hover:bg-gray-50" onClick={() => toggleDayExpansion(dayIndex)}>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">
                      Día {dayIndex + 1} -{" "}
                      {day.date.toLocaleDateString("es-ES", { weekday: "long", month: "long", day: "numeric" })}
                    </CardTitle>
                    <CardDescription>
                      {day.meals.length} comidas • {day.totalCalories} calorías totales
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {!day.expanded && (
                      <div className="text-sm text-gray-600">
                        {day.meals.map((meal) => getMealTypeLabel(meal.mealType)).join(" • ")}
                      </div>
                    )}
                    {day.expanded ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </div>
                </div>
              </CardHeader>

              {day.expanded && (
                <CardContent>
                  <div className="space-y-4">
                    {day.meals.map((meal) => (
                      <div key={meal.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <Checkbox
                              checked={selectedMealIds.includes(meal.id)}
                              onCheckedChange={(checked) => toggleMealSelection(meal.id, checked as boolean)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{getMealTypeLabel(meal.mealType)}</Badge>
                                <h4 className="font-medium">{meal.recipe.name}</h4>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{meal.recipe.description}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium">{meal.recipe.calories * meal.servings}</span>
                                  <span>calorías</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{meal.servings} porción(es)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{meal.recipe.prepTime + meal.recipe.cookTime} min</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={handleRegenerateSelected}
            disabled={selectedMealIds.length === 0 || isRegenerating}
          >
            {isRegenerating ? "Regenerando..." : `Regenerar Comidas Seleccionadas (${selectedMealIds.length})`}
          </Button>

          <Button onClick={handleConfirmMenu} disabled={isConfirming}>
            {isConfirming ? "Confirmando..." : "Confirmar Menú"}
          </Button>
        </div>
      </div>
    </div>
  )
}
