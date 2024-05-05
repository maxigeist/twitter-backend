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
}
