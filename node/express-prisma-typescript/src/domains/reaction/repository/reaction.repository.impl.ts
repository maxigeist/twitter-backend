import { ReactionRepository } from '@domains/reaction/repository/reaction.repository';
import { ExtendedReactionDto, ReactionDto } from '@domains/reaction/dto';
import { PrismaClient } from '@prisma/client';

export class ReactionRepositoryImpl implements ReactionRepository {
  constructor(private readonly db: PrismaClient) {}

  async create(data: ReactionDto): Promise<ExtendedReactionDto> {
    const reaction = await this.db.reaction.create({
      data,
    });
    return new ExtendedReactionDto(reaction);
  }

  async delete(reactionId: string): Promise<void> {
    await this.db.reaction.delete({
      where: {
        id: reactionId,
      },
    });
  }

  async getById(reactionId: string): Promise<ExtendedReactionDto | null> {
    const reaction = await this.db.reaction.findUnique({
      where: {
        id: reactionId
      }
    })
    return reaction ? new ExtendedReactionDto(reaction) : null
  }

  async checkIfReactionExists (reactionTypeId: string): Promise<ExtendedReactionDto | null> {
    const reactions = await this.db.reaction.findMany({
      where: {
        reactionTypeId
      }
    })
    return (reactions.length > 0) ? new ExtendedReactionDto(reactions[0]) : null
  }
}
