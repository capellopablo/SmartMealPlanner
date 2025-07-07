import type { User } from "./user" // Assuming User is declared in another file, e.g., user.ts

export interface AuthResponse {
  success: boolean
  user?: User
  token?: string
  message?: string
  error?: string
}

export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface LoginProvider {
  id: string
  name: string
  icon: string
  enabled: boolean
}
