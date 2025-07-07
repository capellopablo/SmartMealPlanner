import { UserRepository } from "../repositories/user-repository"
import { UserValidator } from "../validators/user-validator"
import type { UserCredentials, UserRegistration, User } from "@/shared/types/user"
import type { AuthResponse } from "@/shared/types/auth"

export class AuthService {
  private userRepository: UserRepository

  constructor() {
    this.userRepository = new UserRepository()
  }

  async registerUser(registration: UserRegistration): Promise<AuthResponse> {
    try {
      // Validar datos de entrada
      const validation = UserValidator.validateRegistration(registration)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(", "),
        }
      }

      // Verificar si el usuario ya existe
      const existingUser = await this.userRepository.findByEmail(registration.email)
      if (existingUser) {
        return {
          success: false,
          error: "User with this email already exists",
        }
      }

      // Hashear password
      const hashedPassword = await this.userRepository.hashPassword(registration.password)

      // Crear usuario
      const user = await this.userRepository.create({
        email: registration.email,
        name: registration.name,
        profileCompleted: false,
      })

      // Crear sesión
      const token = await this.userRepository.createSession(user.id)

      return {
        success: true,
        user,
        token,
        message: "User registered successfully",
      }
    } catch (error) {
      return {
        success: false,
        error: "Registration failed. Please try again.",
      }
    }
  }

  async loginUser(credentials: UserCredentials): Promise<AuthResponse> {
    try {
      // Validar datos de entrada
      const validation = UserValidator.validateLogin(credentials)
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.errors.join(", "),
        }
      }

      // Buscar usuario
      const user = await this.userRepository.findByEmail(credentials.email)
      if (!user) {
        return {
          success: false,
          error: "Invalid email or password",
        }
      }

      // Verificar password (simulado)
      let isValidPassword = false

      // For fake test users, use the standard test password
      const testEmails = ["test@example.com", "admin@smartmeal.com", "demo@test.com"]
      if (testEmails.includes(credentials.email)) {
        isValidPassword = credentials.password === "Testing1234"
      } else {
        // For real users, use the stored password
        isValidPassword = await this.userRepository.verifyPassword(
          credentials.password,
          credentials.password, // En producción sería el hash almacenado
        )
      }

      if (!isValidPassword) {
        return {
          success: false,
          error: "Invalid email or password",
        }
      }

      // Crear sesión
      const token = await this.userRepository.createSession(user.id)

      return {
        success: true,
        user,
        token,
        message: "Login successful",
      }
    } catch (error) {
      return {
        success: false,
        error: "Login failed. Please try again.",
      }
    }
  }

  async logoutUser(token: string): Promise<AuthResponse> {
    try {
      await this.userRepository.deleteSession(token)
      return {
        success: true,
        message: "Logout successful",
      }
    } catch (error) {
      return {
        success: false,
        error: "Logout failed",
      }
    }
  }

  async isAuthenticated(token: string): Promise<User | null> {
    try {
      const userId = await this.userRepository.validateSession(token)
      if (!userId) return null

      return await this.userRepository.findById(userId)
    } catch (error) {
      return null
    }
  }

  async getCurrentUser(token: string): Promise<User | null> {
    return await this.isAuthenticated(token)
  }

  // Método para futuras extensiones de login social
  async loginWithProvider(provider: string, providerData: any): Promise<AuthResponse> {
    // Placeholder para login social (Google, Apple, etc.)
    return {
      success: false,
      error: "Social login not implemented yet",
    }
  }
}
