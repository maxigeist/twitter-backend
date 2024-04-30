import { FollowRepository } from '@domains/follow/repository/follow.repository'
import { PrismaClient } from '@prisma/client'
import { ExtendedFollowDto, FollowDTO } from '@domains/follow/dto'

export class FollowRepositoryImpl implements FollowRepository {
  constructor (private readonly db: PrismaClient) {
  }

  async create (data: FollowDTO): Promise<ExtendedFollowDto> {
    return await this.db.follow.create({
      data
    }).then(follow => new ExtendedFollowDto(follow))
  }

  async delete (followerId: string, followedId: string): Promise<void> {
    // const follow = await this.getFollowId(followerId, followedId)
    // if (follow) {
    console.log('repository')
    await this.db.follow.deleteMany({
      where: {
        followerId,
        followedId
      }
    })
    // }
  }

  async getFollowId (followerId: string, followedId: string): Promise<undefined | string> {
    return await this.db.follow.findFirst({
      where: {
        followerId,
        followedId
      }
    }).then(follow => follow ? follow.id : undefined)
  }
}
