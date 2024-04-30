import { FollowService } from '@domains/follow/service/follow.service'
import { ExtendedFollowDto, FollowDTO } from '@domains/follow/dto'
import { FollowRepository } from '@domains/follow/repository/follow.repository'
import { ValidationException } from '@utils'

export class FollowServiceImpl implements FollowService {
  constructor (private readonly followRepository: FollowRepository) {}
  async createFollow (followerId: string, followedId: string): Promise<ExtendedFollowDto> {
    const follow = { followerId, followedId }
    if (followerId !== followedId) {
      return await this.followRepository.create(new FollowDTO(follow))
    }
    throw new ValidationException([{ message: "A user can't follow himself" }])
  }

  async deleteFollow (followerId: string, followedId: string): Promise<void> {
    await this.followRepository.delete(followerId, followedId)
  }
}
