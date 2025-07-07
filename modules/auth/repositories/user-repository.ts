import type { User, UserProfile } from "@/shared/types/user"

// Simulamos una base de datos en memoria para el ejemplo
// En producción, esto se conectaría a una base de datos real
class InMemoryDatabase {
  private users: Map<string, User> = new Map()
  private profiles: Map<string, UserProfile> = new Map()
  private sessions: Map<string, string> = new Map() // token -> userId

  constructor() {
    // Add fake users for testing
    const fakeUser1: User = {
      id: "user_fake_001",
      email: "test@example.com",
      name: "Test User",
      createdAt: new Date(),
      updatedAt: new Date(),
      profileCompleted: false,
    }

    const fakeUser2: User = {
      id: "user_fake_002",
      email: "admin@smartmeal.com",
      name: "Admin User",
      createdAt: new Date(),
      updatedAt: new Date(),
      profileCompleted: true,
    }

    const fakeUser3: User = {
      id: "user_fake_003",
      email: "demo@test.com",
      name: "Demo User",
      createdAt: new Date(),
      updatedAt: new Date(),
      profileCompleted: false,
    }

    // Add users to the database
    this.users.set(fakeUser1.id, fakeUser1)
    this.users.set(fakeUser2.id, fakeUser2)
    this.users.set(fakeUser3.id, fakeUser3)

    // Add a fake profile for the admin user
    const fakeProfile: UserProfile = {
      userId: "user_fake_002",
      age: 30,
      gender: "male",
      weight: 75,
      height: 180,
      activityLevel: "moderate",
      goal: "maintain",
      dietType: "omnivore",
      restrictions: ["gluten_free"],
      allergies: ["nuts"],
      favoriteIngredients: ["chicken", "broccoli", "rice"],
      dislikedIngredients: ["mushrooms", "cilantro"],
      maxDailyCalories: 2200,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    this.profiles.set("user_fake_002", fakeProfile)
  }

  getUsers() {
    return this.users
  }
  getProfiles() {
    return this.profiles
  }
  getSessions() {
    return this.sessions
  }
}

const db = new InMemoryDatabase()

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    // Simular delay de base de datos
    await new Promise((resolve) => setTimeout(resolve, 100))

    for (const user of db.getUsers().values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  async findById(id: string): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return db.getUsers().get(id) || null
  }

  async create(userData: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const user: User = {
      id: this.generateId(),
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date(),
      profileCompleted: false,
    }

    db.getUsers().set(user.id, user)
    return user
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const user = db.getUsers().get(id)
    if (!user) return null

    const updatedUser = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    }

    db.getUsers().set(id, updatedUser)
    return updatedUser
  }

  async createProfile(profile: Omit<UserProfile, "createdAt" | "updatedAt">): Promise<UserProfile> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const userProfile: UserProfile = {
      ...profile,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    db.getProfiles().set(profile.userId, userProfile)

    // Marcar el perfil como completado
    await this.update(profile.userId, { profileCompleted: true })

    return userProfile
  }

  async getProfile(userId: string): Promise<UserProfile | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return db.getProfiles().get(userId) || null
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    await new Promise((resolve) => setTimeout(resolve, 100))

    const profile = db.getProfiles().get(userId)
    if (!profile) return null

    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date(),
    }

    db.getProfiles().set(userId, updatedProfile)
    return updatedProfile
  }

  async createSession(userId: string): Promise<string> {
    const token = this.generateToken()
    db.getSessions().set(token, userId)
    return token
  }

  async validateSession(token: string): Promise<string | null> {
    return db.getSessions().get(token) || null
  }

  async deleteSession(token: string): Promise<void> {
    db.getSessions().delete(token)
  }

  private generateId(): string {
    return "user_" + Math.random().toString(36).substr(2, 9)
  }

  private generateToken(): string {
    return "token_" + Math.random().toString(36).substr(2, 16)
  }

  // Método para verificar password (en producción usarías bcrypt)
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    // Simulación - en producción usar bcrypt.compare
    return plainPassword === hashedPassword
  }

  // Método para hashear password (en producción usarías bcrypt)
  async hashPassword(password: string): Promise<string> {
    // Simulación - en producción usar bcrypt.hash
    return password
  }
}
