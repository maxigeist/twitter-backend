import { FollowService } from '@domains/follow/service/follow.service'
import { ExtendedFollowDto, FollowDTO } from '@domains/follow/dto'
import { FollowRepository } from '@domains/follow/repository/follow.repository'
import { NotFoundException, uuidValidator, ValidationException } from '@utils'

export class FollowServiceImpl implements FollowService {
  constructor (private readonly followRepository: FollowRepository) {}

  async createFollow (followerId: string, followedId: string): Promise<ExtendedFollowDto> {
    uuidValidator(followerId)
    const follow = {
      followerId,
      followedId
    }
    const extendedFollow = await this.followRepository.getFollow(followerId, followedId)
    if (!extendedFollow) {
      if (followerId !== followedId) {
        try {
          return await this.followRepository.create(new FollowDTO(follow))
        } catch (e) {
          throw new NotFoundException('user')
        }
      }
      throw new ValidationException([{ message: "A user can't follow himself" }])
    }
    return extendedFollow
  }

  async deleteFollow (followerId: string, followedId: string): Promise<void> {
    await this.followRepository.delete(followerId, followedId)
  }

  async getUserFollowedId (followerId: string): Promise<string[]> {
    return await this.followRepository.getUserFollowedId(followerId)
  }

  async userFollows (currentUserId: string, authorId: string): Promise<boolean> {
    return await this.followRepository.userFollows(currentUserId, authorId)
  }
}
