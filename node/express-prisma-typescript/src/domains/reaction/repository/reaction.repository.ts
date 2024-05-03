import { ExtendedReactionDto, ReactionDto } from '@domains/reaction/dto';

export interface ReactionRepository {
  create: (reaction: ReactionDto) => Promise<ExtendedReactionDto>

  delete: (reactionId: string) => Promise<void>

  getById: (reactionId: string) => Promise<ExtendedReactionDto | null>

  checkIfReactionExists: (reactionTypeId: string) => Promise<ExtendedReactionDto | null>

}
