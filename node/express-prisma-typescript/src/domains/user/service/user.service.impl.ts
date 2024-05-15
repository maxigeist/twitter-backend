import { ForbiddenException, NotFoundException } from '@utils/errors'
import { CursorPagination, OffsetPagination } from 'types'
import { UserViewDTO } from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'

import { FollowService, FollowServiceImpl } from '@domains/follow/service'
import { FollowRepositoryImpl } from '@domains/follow/repository'
import { db } from '@utils'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}
  followService: FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db))

  async getUser (userId: string, otherUserId: any): Promise<UserViewDTO> {
    const user = await this.repository.getById(otherUserId)
    if (user) {
      if (!await this.userHasPrivateAccount(otherUserId) || await this.followService.userFollows(userId, otherUserId)) {
        return user
      }
      throw new ForbiddenException()
    }
    throw new NotFoundException('user')
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserViewDTO[]> {
    // TODO: make this return only users followed by users the original user follows
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

  async getUserById (userId: string): Promise<UserViewDTO | null> {
    return await this.repository.getById(userId)
  }
}
