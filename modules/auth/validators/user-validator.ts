import type { UserCredentials, UserRegistration, UserProfile } from "@/shared/types/user"
import type { ValidationResult } from "@/shared/types/auth"

export class UserValidator {
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = []

    if (!email) {
      errors.push("Email is required")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Please enter a valid email address")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validatePassword(password: string): ValidationResult {
    const errors: string[] = []

    if (!password) {
      errors.push("Password is required")
    } else {
      if (password.length < 8) {
        errors.push("Password must be at least 8 characters long")
      }
      if (!/(?=.*[a-z])/.test(password)) {
        errors.push("Password must contain at least one lowercase letter")
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        errors.push("Password must contain at least one uppercase letter")
      }
      if (!/(?=.*\d)/.test(password)) {
        errors.push("Password must contain at least one number")
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateLogin(credentials: UserCredentials): ValidationResult {
    const emailValidation = this.validateEmail(credentials.email)
    const passwordValidation = this.validatePassword(credentials.password)

    return {
      isValid: emailValidation.isValid && passwordValidation.isValid,
      errors: [...emailValidation.errors, ...passwordValidation.errors],
    }
  }

  static validateRegistration(registration: UserRegistration): ValidationResult {
    const errors: string[] = []

    // Validar email y password
    const emailValidation = this.validateEmail(registration.email)
    const passwordValidation = this.validatePassword(registration.password)

    errors.push(...emailValidation.errors, ...passwordValidation.errors)

    // Validar nombre
    if (!registration.name || registration.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long")
    }

    // Validar confirmación de password
    if (registration.password !== registration.confirmPassword) {
      errors.push("Passwords do not match")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  static validateUserProfile(profile: Partial<UserProfile>): ValidationResult {
    const errors: string[] = []

    if (profile.age && (profile.age < 13 || profile.age > 120)) {
      errors.push("Age must be between 13 and 120 years")
    }

    if (profile.weight && (profile.weight < 30 || profile.weight > 300)) {
      errors.push("Weight must be between 30 and 300 kg")
    }

    if (profile.height && (profile.height < 100 || profile.height > 250)) {
      errors.push("Height must be between 100 and 250 cm")
    }

    if (profile.maxDailyCalories && (profile.maxDailyCalories < 800 || profile.maxDailyCalories > 5000)) {
      errors.push("Daily calories must be between 800 and 5000")
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }
}
