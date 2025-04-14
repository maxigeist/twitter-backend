import { NotFoundException } from '@utils/errors'
import { CursorPagination, OffsetPagination } from 'types'
import { UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'

import { FollowService, FollowServiceImpl } from '@domains/follow/service'
import { FollowRepositoryImpl } from '@domains/follow/repository'
import { db } from '@utils/database'
import { uuidValidator } from '@utils/validation'
import { getSignedUrlAux } from '@bucket'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}
  followService: FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db))

  async getUser (userId: string, otherUserId: any): Promise<UserViewDTO> {
    uuidValidator(otherUserId)
    const user = await this.repository.getById(userId, otherUserId)
    if (user) {
      return user
    }
    throw new NotFoundException('user')
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserViewDTO[]> {
    const usersFollowedId = await this.followService.getUserFollowedId(userId)
    const userFollowedFollowedId: string[] = []
    for (const userFollowedId of usersFollowedId) {
      const userFollowedFollowedIdAux = await this.followService.getUserFollowedId(userFollowedId)
      for (const userFollowedIdBis of userFollowedFollowedIdAux) {
        if (!usersFollowedId.includes(userFollowedIdBis) && userFollowedIdBis !== userId) {
          userFollowedFollowedId.push(userFollowedIdBis)
        }
      }
    }
    return await this.repository.getRecommendedUsersPaginated(userFollowedFollowedId, options)
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }

  async getUsersByUsername (username: string, options: CursorPagination): Promise<UserViewDTO[]> {
    return await this.repository.getUsersByUsername(username, options)
  }

  async userHasPrivateAccount (userId: string): Promise<boolean> {
    return await this.repository.userHasPrivateAccount(userId)
  }

  async saveProfilePicture (userId: string): Promise<string> {
    const url = await getSignedUrlAux(userId + '-profile-picture')
    await this.repository.savePicture(userId, userId + '-profile-picture')
    return url
  }

  async changeVisibility (userId: string): Promise<void> {
    if (await this.userHasPrivateAccount(userId)) {
      await this.repository.changeVisibility(userId, 'public')
    } else {
      await this.repository.changeVisibility(userId, 'private')
    }
  }

  async getFollowedUsers (userId: string): Promise<UserViewDTO[]> {
    console.log('hola')
    return await this.repository.getFollowedUsers(userId)
  }
}
