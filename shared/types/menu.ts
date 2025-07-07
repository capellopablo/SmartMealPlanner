export type MealType = "breakfast" | "lunch" | "snack" | "dinner"

export interface Recipe {
  id: string
  name: string
  description: string
  calories: number
  servings: number
  ingredients: string[]
  instructions: string[]
  prepTime: number // minutes
  cookTime: number // minutes
  mealType: MealType
  tags: string[]
}

export interface Meal {
  id: string
  recipe: Recipe
  date: Date
  mealType: MealType
  servings: number
  selected?: boolean // for regeneration selection
}

export interface DayMenu {
  date: Date
  meals: Meal[]
  totalCalories: number
  expanded?: boolean // for UI state
}

export interface WeeklyMenu {
  id: string
  userId: string
  name: string
  startDate: Date
  endDate: Date
  days: DayMenu[]
  status: "active" | "pending" | "completed"
  totalDays: number
  mealsPerDay: MealType[]
  maxCaloriesPerDay: number
  servingsPerMeal: number
  createdAt: Date
  updatedAt: Date
}

export interface MenuGenerationRequest {
  startDate: Date
  days: number
  mealsPerDay: MealType[]
  maxCaloriesPerDay: number
  servings: number
}

export interface MenuStats {
  totalMenus: number
  activeMenus: number
  completedMenus: number
  totalMeals: number
}
