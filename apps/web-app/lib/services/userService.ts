import 'server-only'

import {
  createUserRepository,
  type UserRepository,
} from '@better-stack-monorepo/database/src/repositories/userRepository'
import { ServiceError } from '@/lib/services/errors'
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
      throw new ServiceError(403, "Cannot update another user's settings")
    }

    const updatedUser = await this.userRepository.updateUser(userId, {
      name: data.name,
      image: data.image,
    })

    if (!updatedUser) {
      throw new ServiceError(404, 'User not found')
    }

    return updatedUser
  }
}

export const createUserService = (req: ServiceContext) => {
  const userRepository = createUserRepository()

  return new UserService(userRepository, req)
}
