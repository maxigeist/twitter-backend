import { ExtendedReactionDto, ReactionDto } from '@domains/reaction/dto'
import { CommentDTO } from '@domains/comment/dto'

export interface ReactionRepository {
  create: (reaction: ReactionDto) => Promise<ExtendedReactionDto>

  delete: (reactionId: string) => Promise<void>

  getById: (reactionId: string) => Promise<ExtendedReactionDto | null>

  checkIfReactionExists: (reactionTypeId: string) => Promise<ExtendedReactionDto | null>

  getReactionTypeId: (type: string) => Promise<string | null>

  getLikesFromUser: (userId: string) => Promise<ExtendedReactionDto[]>

  getRetweetsFromUser: (userId: string) => Promise<ExtendedReactionDto[]>

}
