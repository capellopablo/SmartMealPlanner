export interface UserCredentials {
  email: string
  password: string
}

export interface UserRegistration extends UserCredentials {
  name: string
  confirmPassword: string
}

export interface User {
  id: string
  email: string
  name: string
  createdAt: Date
  updatedAt: Date
  profileCompleted: boolean
}

export interface UserProfile {
  userId: string
  // Datos personales
  age: number
  gender: "male" | "female" | "other"
  weight: number // kg
  height: number // cm
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active"

  // Objetivos
  goal: "lose_weight" | "maintain" | "gain_muscle" | "gain_weight"

  // Preferencias alimenticias
  dietType: "omnivore" | "vegetarian" | "vegan" | "keto" | "paleo" | "mediterranean"

  // Restricciones y alergias
  restrictions: string[] // ['gluten_free', 'lactose_free', 'nut_free', etc.]
  allergies: string[]

  // Preferencias de alimentos
  favoriteIngredients: string[]
  dislikedIngredients: string[]

  // Configuración calórica
  maxDailyCalories?: number

  // Metadata
  createdAt: Date
  updatedAt: Date
}

export interface OnboardingStep {
  step: number
  title: string
  completed: boolean
  data?: any
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
