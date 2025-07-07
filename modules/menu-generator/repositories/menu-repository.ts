import type { WeeklyMenu, MenuStats, Recipe, MealType } from "@/shared/types/menu"

// Simulamos una base de datos en memoria
class InMemoryMenuDatabase {
  private menus: Map<string, WeeklyMenu> = new Map()
  private recipes: Map<string, Recipe> = new Map()

  constructor() {
    // Add some fake recipes for testing
    this.seedFakeRecipes()
  }

  private seedFakeRecipes() {
    const fakeRecipes: Recipe[] = [
      // Breakfast recipes
      {
        id: "recipe_001",
        name: "Avocado Toast",
        description: "Whole grain toast with mashed avocado and cherry tomatoes",
        calories: 180,
        servings: 1,
        ingredients: ["2 slices whole grain bread", "1 ripe avocado", "5 cherry tomatoes", "Salt", "Pepper"],
        instructions: ["Toast bread", "Mash avocado", "Top with tomatoes"],
        prepTime: 5,
        cookTime: 2,
        mealType: "breakfast",
        tags: ["vegetarian", "healthy"],
      },
      {
        id: "recipe_002",
        name: "Greek Yogurt Bowl",
        description: "Greek yogurt with berries and granola",
        calories: 190,
        servings: 1,
        ingredients: ["1 cup Greek yogurt", "1/2 cup mixed berries", "2 tbsp granola"],
        instructions: ["Add yogurt to bowl", "Top with berries and granola"],
        prepTime: 3,
        cookTime: 0,
        mealType: "breakfast",
        tags: ["protein", "healthy"],
      },
      // Lunch recipes
      {
        id: "recipe_003",
        name: "Quinoa Salad",
        description: "Fresh quinoa salad with vegetables and lemon dressing",
        calories: 195,
        servings: 1,
        ingredients: ["1 cup cooked quinoa", "1/2 cucumber", "1 tomato", "Lemon juice", "Olive oil"],
        instructions: ["Mix quinoa with vegetables", "Add dressing"],
        prepTime: 10,
        cookTime: 0,
        mealType: "lunch",
        tags: ["vegetarian", "gluten-free"],
      },
      {
        id: "recipe_004",
        name: "Chicken Wrap",
        description: "Grilled chicken wrap with vegetables",
        calories: 185,
        servings: 1,
        ingredients: ["1 whole wheat tortilla", "100g grilled chicken", "Lettuce", "Tomato", "Cucumber"],
        instructions: ["Grill chicken", "Assemble wrap with vegetables"],
        prepTime: 5,
        cookTime: 10,
        mealType: "lunch",
        tags: ["protein", "balanced"],
      },
      // Dinner recipes
      {
        id: "recipe_005",
        name: "Baked Salmon",
        description: "Herb-crusted baked salmon with steamed vegetables",
        calories: 200,
        servings: 1,
        ingredients: ["150g salmon fillet", "Mixed herbs", "Broccoli", "Carrots", "Olive oil"],
        instructions: ["Season salmon", "Bake for 15 minutes", "Steam vegetables"],
        prepTime: 10,
        cookTime: 15,
        mealType: "dinner",
        tags: ["protein", "omega-3"],
      },
      {
        id: "recipe_006",
        name: "Vegetable Stir Fry",
        description: "Mixed vegetable stir fry with tofu",
        calories: 175,
        servings: 1,
        ingredients: ["200g mixed vegetables", "100g tofu", "Soy sauce", "Ginger", "Garlic"],
        instructions: ["Heat oil", "Stir fry vegetables and tofu", "Season with sauce"],
        prepTime: 8,
        cookTime: 12,
        mealType: "dinner",
        tags: ["vegetarian", "low-calorie"],
      },
    ]

    fakeRecipes.forEach((recipe) => {
      this.recipes.set(recipe.id, recipe)
    })
  }

  getMenus() {
    return this.menus
  }

  getRecipes() {
    return this.recipes
  }
}

const menuDb = new InMemoryMenuDatabase()

export class MenuRepository {
  async findByUserId(userId: string): Promise<WeeklyMenu[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const userMenus: WeeklyMenu[] = []
    for (const menu of menuDb.getMenus().values()) {
      if (menu.userId === userId) {
        userMenus.push(menu)
      }
    }

    return userMenus.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  async findById(id: string): Promise<WeeklyMenu | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return menuDb.getMenus().get(id) || null
  }

  async create(menu: Omit<WeeklyMenu, "id" | "createdAt" | "updatedAt">): Promise<WeeklyMenu> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const newMenu: WeeklyMenu = {
      id: this.generateId(),
      ...menu,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    menuDb.getMenus().set(newMenu.id, newMenu)
    return newMenu
  }

  async update(id: string, updates: Partial<WeeklyMenu>): Promise<WeeklyMenu | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const menu = menuDb.getMenus().get(id)
    if (!menu) return null

    const updatedMenu = {
      ...menu,
      ...updates,
      updatedAt: new Date(),
    }

    menuDb.getMenus().set(id, updatedMenu)
    return updatedMenu
  }

  async getStats(userId: string): Promise<MenuStats> {
    const userMenus = await this.findByUserId(userId)

    return {
      totalMenus: userMenus.length,
      activeMenus: userMenus.filter((m) => m.status === "active" || m.status === "pending").length,
      completedMenus: userMenus.filter((m) => m.status === "completed").length,
      totalMeals: userMenus.reduce(
        (total, menu) => total + menu.days.reduce((dayTotal, day) => dayTotal + day.meals.length, 0),
        0,
      ),
    }
  }

  async getRecipesByMealType(mealType: MealType): Promise<Recipe[]> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const recipes: Recipe[] = []
    for (const recipe of menuDb.getRecipes().values()) {
      if (recipe.mealType === mealType) {
        recipes.push(recipe)
      }
    }

    return recipes
  }

  private generateId(): string {
    return "menu_" + Math.random().toString(36).substr(2, 9)
  }
}
