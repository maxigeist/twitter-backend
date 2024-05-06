import { CommentService } from '@domains/comment/service/interfaces/comment.service'
import { CommentDTO, CreateCommentInputDTO } from '@domains/comment/dto'
import { PostServiceImpl } from '@domains/post/service'
import { PostRepositoryImpl } from '@domains/post/repository'
import { db } from '@utils'

export class CommentServiceImpl implements CommentService {
  postService: PostServiceImpl = new PostServiceImpl(new PostRepositoryImpl(db))

  async createComment (userId: string, body: CreateCommentInputDTO, postId: string): Promise<CommentDTO> {
    return await this.postService.createComment(userId, body, postId)
  }

  async getCommentsByUser (userId: string, authorId: string): Promise<CommentDTO[]> {
    return await this.postService.getCommentsByUser(userId, authorId)
  }
}
