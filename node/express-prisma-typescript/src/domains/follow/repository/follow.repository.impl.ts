import { FollowRepository } from '@domains/follow/repository/follow.repository'
import { PrismaClient } from '@prisma/client'
import { ExtendedFollowDto, FollowDTO } from '@domains/follow/dto'

export class FollowRepositoryImpl implements FollowRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (data: FollowDTO): Promise<ExtendedFollowDto> {
    const follow = await this.db.follow.create({
      data
    })
    return new ExtendedFollowDto(follow)
  }

  async delete (followerId: string, followedId: string): Promise<void> {
    await this.db.follow.deleteMany({
      where: {
        followerId,
        followedId
      }
    })
  }

  async getFollow (followerId: string, followedId: string): Promise<ExtendedFollowDto | null> {
    const follow = await this.db.follow.findFirst({
      where: {
        followerId,
        followedId
      }
    })
    return follow ? new ExtendedFollowDto(follow) : null
  }

  async getUserFollowedId (followerId: string): Promise<string[]> {
    const followedID = await this.db.follow.findMany({
      where: {
        followerId
      },
      select: {
        followedId: true
      }
    })
    return followedID.map((followedId) => followedId.followedId)
  }

  async userFollows (currentUserId: string, authorId: string): Promise<boolean> {
    return await this.db.follow
      .findFirst({
        where: {
          followerId: currentUserId,
          followedId: authorId
        },
        select: {
          id: true
        }
      })
      .then((id) => !!id)
  }
}
