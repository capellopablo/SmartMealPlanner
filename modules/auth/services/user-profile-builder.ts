import { UserRepository } from "../repositories/user-repository"
import { UserValidator } from "../validators/user-validator"
import type { UserProfile, OnboardingStep } from "@/shared/types/user"

export interface OnboardingData {
  personalInfo: {
    age: number
    gender: "male" | "female" | "other"
    weight: number
    height: number
    activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"
  }
  goals: {
    goal: "lose_weight" | "maintain" | "gain_muscle" | "gain_weight"
  }
  preferences: {
    dietType: "omnivore" | "vegetarian" | "vegan" | "keto" | "paleo" | "mediterranean"
  }
  restrictions: {
    restrictions: string[]
    allergies: string[]
  }
  foodPreferences: {
    favoriteIngredients: string[]
    dislikedIngredients: string[]
  }
  calories: {
    maxDailyCalories?: number
  }
}

export class UserProfileBuilder {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  getOnboardingSteps(): OnboardingStep[] {
    return [
      {
        step: 1,
        title: "Personal Information",
        completed: false,
        data: null,
      },
      {
        step: 2,
        title: "Your Goals",
        completed: false,
        data: null,
      },
      {
        step: 3,
        title: "Diet Preferences",
        completed: false,
        data: null,
      },
      {
        step: 4,
        title: "Restrictions & Allergies",
        completed: false,
        data: null,
      },
      {
        step: 5,
        title: "Food Preferences",
        completed: false,
        data: null,
      },
      {
        step: 6,
        title: "Calorie Settings",
        completed: false,
        data: null,
      },
    ]
  }

  async createProfile(userId: string, onboardingData: OnboardingData): Promise<UserProfile | null> {
    try {
      // Add debugging and validation
      console.log("Creating profile with data:", onboardingData)

      // Validate that all required data is present
      if (!onboardingData.personalInfo) {
        throw new Error("Personal information is missing")
      }
      if (!onboardingData.goals) {
        throw new Error("Goals information is missing")
      }
      if (!onboardingData.preferences) {
        throw new Error("Preferences information is missing")
      }
      if (!onboardingData.restrictions) {
        throw new Error("Restrictions information is missing")
      }
      if (!onboardingData.foodPreferences) {
        throw new Error("Food preferences information is missing")
      }
      if (!onboardingData.calories) {
        throw new Error("Calories information is missing")
      }

      const profile: Omit<UserProfile, "createdAt" | "updatedAt"> = {
        userId,
        age: onboardingData.personalInfo.age,
        gender: onboardingData.personalInfo.gender,
        weight: onboardingData.personalInfo.weight,
        height: onboardingData.personalInfo.height,
        activityLevel: onboardingData.personalInfo.activityLevel,
        goal: onboardingData.goals.goal,
        dietType: onboardingData.preferences.dietType,
        restrictions: onboardingData.restrictions.restrictions || [],
        allergies: onboardingData.restrictions.allergies || [],
        favoriteIngredients: onboardingData.foodPreferences.favoriteIngredients || [],
        dislikedIngredients: onboardingData.foodPreferences.dislikedIngredients || [],
        maxDailyCalories: onboardingData.calories.maxDailyCalories || undefined,
      }

      // Validar perfil
      const validation = UserValidator.validateUserProfile(profile)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "))
      }

      return await this.userRepository.createProfile(profile)
    } catch (error) {
      console.error("Error creating profile:", error)
      return null
    }
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    try {
      // Validar actualizaciones
      const validation = UserValidator.validateUserProfile(updates)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(", "))
      }

      return await this.userRepository.updateProfile(userId, updates)
    } catch (error) {
      console.error("Error updating profile:", error)
      return null
    }
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    return await this.userRepository.getProfile(userId)
  }

  calculateBMR(profile: UserProfile): number {
    // Fórmula de Harris-Benedict revisada
    let bmr: number

    if (profile.gender === "male") {
      bmr = 88.362 + 13.397 * profile.weight + 4.799 * profile.height - 5.677 * profile.age
    } else {
      bmr = 447.593 + 9.247 * profile.weight + 3.098 * profile.height - 4.33 * profile.age
    }

    // Ajustar por nivel de actividad
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    }

    return Math.round(bmr * activityMultipliers[profile.activityLevel])
  }

  getRecommendedCalories(profile: UserProfile): number {
    const bmr = this.calculateBMR(profile)

    // Ajustar según objetivo
    switch (profile.goal) {
      case "lose_weight":
        return Math.round(bmr * 0.8) // Déficit del 20%
      case "gain_weight":
      case "gain_muscle":
        return Math.round(bmr * 1.1) // Superávit del 10%
      case "maintain":
      default:
        return bmr
    }
  }
}
