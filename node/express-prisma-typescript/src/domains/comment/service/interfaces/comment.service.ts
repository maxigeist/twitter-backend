import { CommentDTO, CreateCommentInputDTO } from '@domains/comment/dto'
import { CursorPagination } from '@types'

export interface CommentService {

  createComment: (userId: string, body: CreateCommentInputDTO, postId: string) => Promise<CommentDTO>
  getCommentsByUser: (userId: string, authorId: string) => Promise<CommentDTO[]>
  getCommentsByPost: (userId: string, postId: string, options: CursorPagination) => Promise<CommentDTO[]>

}
