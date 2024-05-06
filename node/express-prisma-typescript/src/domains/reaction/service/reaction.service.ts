import { ExtendedReactionDto } from '@domains/reaction/dto'

export interface ReactionService {
  createReaction: (userId: string, reactionTypeId: string, postId: string) => Promise<ExtendedReactionDto>
  deleteReaction: (reactionId: string, postId: string) => Promise<void>
  getLikesFromUser: (userId: string, authorId: string) => Promise<ExtendedReactionDto[]>
  getRetweetsFromUser: (userId: string, authorId: string) => Promise<ExtendedReactionDto[]>
}
