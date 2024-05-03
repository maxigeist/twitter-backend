import { CursorPagination } from '@types'
import { CreatePostInputDTO, PostDTO } from '../dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  getAllByDatePaginated: (options: CursorPagination) => Promise<PostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<PostDTO | null>
  getByAuthorId: (authorId: string) => Promise<PostDTO[]>
  getAuthorIdByPostId: (postId: string) => Promise<string>
  getPostFromFollowedOrPublic: (currentUserId: string, options: CursorPagination) => Promise<PostDTO[]>
  userFollows: (currentUserId: string, authorId: string) => Promise<boolean>
  userHasPrivateAccount: (authorId: string) => Promise<boolean>
}
