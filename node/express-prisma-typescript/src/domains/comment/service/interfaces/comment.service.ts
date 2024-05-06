import { CommentDTO, CreateCommentInputDTO } from '@domains/comment/dto'

export interface CommentService {

  createComment: (userId: string, body: CreateCommentInputDTO, postId: string) => Promise<CommentDTO>
  getCommentsByUser: (userId: string, authorId: string) => Promise<CommentDTO[]>

}
