import { ReactionRepository } from '@domains/reaction/repository/reaction.repository'
import { ExtendedReactionDto, ReactionDto } from '@domains/reaction/dto'
import { PrismaClient } from '@prisma/client'

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, postId: string, reactionTypeId: string): Promise<ExtendedReactionDto> {
    const reaction = await this.db.reaction.create({
      data: {
        userId,
        postId,
        reactionTypeId
      }
    })
    return new ExtendedReactionDto(reaction)
  }

  async delete (reactionId: string): Promise<void> {
    await this.db.reaction.delete({
      where: {
        id: reactionId
      }
    })
  }

  async getById (reactionId: string): Promise<ExtendedReactionDto | null> {
    const reaction = await this.db.reaction.findUnique({
      where: {
        id: reactionId
      }
    })
    return reaction ? new ExtendedReactionDto(reaction) : null
  }

  async getReactionTypeId (type: string): Promise<string | null> {
    const reactionTypeId = await this.db.reactionType.findFirst({
      where: {
        type
      }
    })
    return reactionTypeId ? reactionTypeId.id : null
  }

  async checkIfReactionExists (userId: string, reactionTypeId: string, postId: string): Promise<ExtendedReactionDto | null> {
    const reactions = await this.db.reaction.findMany({
      where: {
        userId,
        reactionTypeId,
        postId
      }
    })
    return (reactions.length > 0) ? new ExtendedReactionDto(reactions[0]) : null
  }

  async getLikesFromUser (userId: string): Promise<ExtendedReactionDto[]> {
    const likes = await this.db.reaction.findMany({
      where: {
        userId,
        type: {
          type: 'like'
        }
      }
    })
    return likes.map((like) => new ExtendedReactionDto(like))
  }

  async getRetweetsFromUser (userId: string): Promise<ExtendedReactionDto[]> {
    const retweets = await this.db.reaction.findMany({
      where: {
        userId,
        type: {
          type: 'retweet'
        }
      }
    })
    return retweets.map((retweet) => new ExtendedReactionDto(retweet))
  }
}
