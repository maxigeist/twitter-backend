import { CursorPagination } from '@types'
import { CommentDTO, CreateCommentInputDTO, CreatePostInputDTO, PostDTO } from '../dto'

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
}
