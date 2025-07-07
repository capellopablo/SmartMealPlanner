import { MenuRepository } from "../repositories/menu-repository"
import type { WeeklyMenu, MenuGenerationRequest, DayMenu, Meal, MealType, Recipe } from "@/shared/types/menu"

export class MenuGeneratorService {
  private menuRepository: MenuRepository

  constructor() {
    this.menuRepository = new MenuRepository()
  }

  async generateMenu(userId: string, request: MenuGenerationRequest): Promise<WeeklyMenu> {
    // Generate days array
    const days: DayMenu[] = []
    const startDate = new Date(request.startDate)

    for (let i = 0; i < request.days; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)

      const dayMeals: Meal[] = []
      let totalCalories = 0

      // Generate meals for each meal type requested
      for (const mealType of request.mealsPerDay) {
        const recipe = await this.getRandomRecipeForMealType(mealType)
        if (recipe) {
          const meal: Meal = {
            id: this.generateMealId(),
            recipe,
            date: currentDate,
            mealType,
            servings: request.servings,
            selected: false,
          }
          dayMeals.push(meal)
          totalCalories += recipe.calories * request.servings
        }
      }

      days.push({
        date: currentDate,
        meals: dayMeals,
        totalCalories,
        expanded: false,
      })
    }

    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + request.days - 1)

    const menu: Omit<WeeklyMenu, "id" | "createdAt" | "updatedAt"> = {
      userId,
      name: `Menu ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
      startDate,
      endDate,
      days,
      status: "pending",
      totalDays: request.days,
      mealsPerDay: request.mealsPerDay,
      maxCaloriesPerDay: request.maxCaloriesPerDay,
      servingsPerMeal: request.servings,
    }

    return await this.menuRepository.create(menu)
  }

  async regenerateSelectedMeals(menuId: string, selectedMealIds: string[]): Promise<WeeklyMenu | null> {
    const menu = await this.menuRepository.findById(menuId)
    if (!menu) return null

    // Find and regenerate selected meals
    for (const day of menu.days) {
      for (let i = 0; i < day.meals.length; i++) {
        const meal = day.meals[i]
        if (selectedMealIds.includes(meal.id)) {
          // Generate new recipe for this meal type
          const newRecipe = await this.getRandomRecipeForMealType(meal.mealType)
          if (newRecipe) {
            day.meals[i] = {
              ...meal,
              id: this.generateMealId(),
              recipe: newRecipe,
              selected: false,
            }
          }
        }
      }

      // Recalculate total calories for the day
      day.totalCalories = day.meals.reduce((total, meal) => total + meal.recipe.calories * meal.servings, 0)
    }

    return await this.menuRepository.update(menuId, { days: menu.days })
  }

  async confirmMenu(menuId: string): Promise<WeeklyMenu | null> {
    return await this.menuRepository.update(menuId, { status: "active" })
  }

  async getUserMenus(userId: string): Promise<WeeklyMenu[]> {
    return await this.menuRepository.findByUserId(userId)
  }

  async getMenuById(id: string): Promise<WeeklyMenu | null> {
    return await this.menuRepository.findById(id)
  }

  private async getRandomRecipeForMealType(mealType: MealType): Promise<Recipe | null> {
    const recipes = await this.menuRepository.getRecipesByMealType(mealType)
    if (recipes.length === 0) return null

    const randomIndex = Math.floor(Math.random() * recipes.length)
    return recipes[randomIndex]
  }

  private generateMealId(): string {
    return "meal_" + Math.random().toString(36).substr(2, 9)
  }
}
