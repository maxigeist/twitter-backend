import { CursorPagination } from '@types'
import { CreatePostInputDTO, PostDTO } from '../dto'
import { CommentDTO, CreateCommentInputDTO } from '@domains/comment/dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  createComment: (userId: string, data: CreateCommentInputDTO, postId: string) => Promise <CommentDTO>
  getAllByDatePaginated: (options: CursorPagination) => Promise<PostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<PostDTO | null>
  getByAuthorId: (authorId: string) => Promise<PostDTO[]>
  getAuthorIdByPostId: (postId: string) => Promise<string>
  getPostFromFollowedOrPublic: (currentUserId: string, options: CursorPagination) => Promise<PostDTO[]>
  userFollows: (currentUserId: string, authorId: string) => Promise<boolean>
  userHasPrivateAccount: (authorId: string) => Promise<boolean>
  getCommentsByAuthorId: (authorId: string) => Promise<CommentDTO[]>
}
