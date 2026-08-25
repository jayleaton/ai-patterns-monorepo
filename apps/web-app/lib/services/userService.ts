import 'server-only'

import {
  createUserRepository,
  type UserRepository,
} from '@better-stack-monorepo/database/src/repositories/userRepository'
import type { ServiceContext } from '@/lib/types'
import type { UpdateUserSettingsInput } from '@/lib/validators/userSchemas'

export class UserService {
  private readonly userRepository: UserRepository
  private readonly context: ServiceContext

  constructor(userRepository: UserRepository, context: ServiceContext) {
    this.userRepository = userRepository
    this.context = context
  }

  async getUserDataSummary() {
    return this.userRepository.getUserDataSummary(this.context.user.id)
  }

  async deleteAllUserData() {
    // This will cascade delete all associated data due to foreign key constraints
    await this.userRepository.deleteUser(this.context.user.id)
  }

  async updateUserSettings(userId: string, data: UpdateUserSettingsInput) {
    // Ensure user can only update their own data
    if (userId !== this.context.user.id) {
      throw new Error("Unauthorized: Cannot update another user's settings")
    }

    // If email is being updated, check if it's already taken
    if (data.email && data.email !== this.context.user.email) {
      const existingUser = await this.userRepository.getUserByEmail(data.email)
      if (existingUser) {
        throw new Error('Email already in use')
      }
    }

    const updatedUser = await this.userRepository.updateUser(userId, {
      name: data.name,
      email: data.email,
      image: data.image ?? undefined,
    })

    if (!updatedUser) {
      throw new Error('User not found')
    }

    return updatedUser
  }
}

export const createUserService = (req: ServiceContext) => {
  const userRepository = createUserRepository()

  return new UserService(userRepository, req)
}
