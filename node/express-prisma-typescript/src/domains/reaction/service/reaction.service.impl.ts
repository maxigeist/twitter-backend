import { ReactionService } from '@domains/reaction/service/reaction.service'
import { ExtendedReactionDto, ReactionDto } from '@domains/reaction/dto'
import { ReactionRepository } from '@domains/reaction/repository/reaction.repository'
import { PostServiceImpl } from '@domains/post/service'
import { PostRepositoryImpl } from '@domains/post/repository'
import { db, NotFoundException } from '@utils'

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly reactionRepository: ReactionRepository) {
  }

  postService: PostServiceImpl = new PostServiceImpl(new PostRepositoryImpl(db))

  async createReaction (userId: string, reactionType: string, postId: string): Promise<ExtendedReactionDto> {
    const reactionTypeId = await this.reactionRepository.getReactionTypeId(reactionType) as string
    const reaction = { userId, reactionTypeId, postId }
    if (await this.postService.getById(postId)) {
      const reactionFromDB = await this.reactionRepository.checkIfReactionExists(userId, reactionTypeId, postId)
      if (!reactionFromDB) {
        const authorId = await this.postService.getPostAuthorId(postId)
        if (await this.postService.checkAccessToPost(userId, authorId)) {
          return await this.reactionRepository.create(new ReactionDto(reaction))
        }
      }
      await this.deleteReaction(reactionFromDB?.id as string)
      return reactionFromDB as ExtendedReactionDto
    }
    throw new NotFoundException('post')
  }

  async deleteReaction (reactionId: string): Promise<void> {
    const reaction = await this.reactionRepository.getById(reactionId)
    if (reaction) {
      await this.reactionRepository.delete(reactionId)
    } else {
      throw new NotFoundException('reaction')
    }
  }

  async getLikesFromUser (userId: string, authorId: string): Promise<ExtendedReactionDto[]> {
    await this.postService.checkAccessToPost(userId, authorId)
    return await this.reactionRepository.getLikesFromUser(authorId)
  }

  async getRetweetsFromUser (userId: string, authorId: string): Promise<ExtendedReactionDto[]> {
    await this.postService.checkAccessToPost(userId, authorId)
    return await this.reactionRepository.getRetweetsFromUser(authorId)
  }
}
