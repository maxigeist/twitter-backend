import { ReactionRepository } from '@domains/reaction/repository/reaction.repository'
import { ExtendedReactionDto } from '@domains/reaction/dto'
import { PrismaClient } from '@prisma/client'

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, postId: string, reactionTypeId: string): Promise<ExtendedReactionDto> {
    const reaction = await this.db.reaction.create({
      data: {
        userId,
        postId,
        reactionTypeId
      },
      include: {
        type: {
          select: {
            type: true
          }
        }
      }
    })
    return new ExtendedReactionDto({ ...reaction, type: reaction.type.type })
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
      },
      include: {
        type: {
          select: {
            type: true
          }
        }
      }
    })
    return reaction ? new ExtendedReactionDto({ ...reaction, type: reaction.type.type }) : null
  }

  async getReactionTypeId (type: string): Promise<string | null> {
    const reactionTypeId = await this.db.reactionType.findFirst({
      where: {
        type
      }
    })
    return reactionTypeId ? reactionTypeId.id : null
  }

  async checkIfReactionExists (
    userId: string,
    reactionTypeId: string,
    postId: string
  ): Promise<ExtendedReactionDto | null> {
    const reactions = await this.db.reaction.findMany({
      where: {
        userId,
        reactionTypeId,
        postId
      },
      include: {
        type: {
          select: {
            type: true
          }
        }
      }
    })
    return reactions.length > 0 ? new ExtendedReactionDto({ ...reactions[0], type: reactions[0].type.type }) : null
  }

  async getLikesFromUser (userId: string): Promise<ExtendedReactionDto[]> {
    const likes = await this.db.reaction.findMany({
      where: {
        userId,
        type: {
          type: 'like'
        }
      },
      include: {
        type: {
          select: {
            type: true
          }
        }
      }
    })
    return likes.map((like) => new ExtendedReactionDto({ ...like, type: like.type.type }))
  }

  async getRetweetsFromUser (userId: string): Promise<ExtendedReactionDto[]> {
    const retweets = await this.db.reaction.findMany({
      where: {
        userId,
        type: {
          type: 'retweet'
        }
      },
      include: {
        type: {
          select: {
            type: true
          }
        }
      }
    })
    return retweets.map((retweet) => new ExtendedReactionDto({ ...retweet, type: retweet.type.type }))
  }
}
