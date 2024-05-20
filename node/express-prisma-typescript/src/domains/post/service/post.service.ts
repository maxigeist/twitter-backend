import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { CommentDTO, CreateCommentInputDTO } from '@domains/comment/dto'
import { CursorPagination } from '@types'

export interface PostService {
  createPost: (userId: string, body: CreatePostInputDTO) => Promise<PostDTO>
  createComment: (userId: string, body: CreateCommentInputDTO, postId: string) => Promise<CommentDTO>
  deletePost: (userId: string, postId: string) => Promise<void>
  getPost: (userId: string, postId: string) => Promise<PostDTO>
  getLatestPosts: (userId: string, options: { limit?: number, before?: string, after?: string }) => Promise<PostDTO[]>
  getPostsByAuthor: (userId: any, authorId: string) => Promise<ExtendedPostDTO[]>
  getById: (postId: string) => Promise<PostDTO | null>
  getPostAuthorId: (postId: string) => Promise<string>
  getCommentsByUser: (userId: string, authorId: string) => Promise<CommentDTO[]>
  getCommentsByPost: (userId: string, options: CursorPagination, postId: string) => Promise <ExtendedPostDTO[]>
}
