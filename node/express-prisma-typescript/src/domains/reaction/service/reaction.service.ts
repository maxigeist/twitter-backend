import { ExtendedReactionDto } from '@domains/reaction/dto'

export interface ReactionService {
  createReaction: (userId: string, reactionTypeId: string, postId: string) => Promise<ExtendedReactionDto>
  deleteReaction: (reactionId: string, postId: string) => Promise<void>
}
