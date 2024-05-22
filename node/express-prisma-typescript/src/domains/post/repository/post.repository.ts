import { CursorPagination } from '@types'
import { CreatePostInputDTO, PostDTO } from '../dto'
import { CommentDTO, CreateCommentInputDTO } from '@domains/comment/dto'
import { Prisma } from '@prisma/client'

export type PostWithReactionsAndAuthor = Prisma.PostGetPayload<{
  include: {
    reactions: {
      select: {
        type: true
      }
    }
    author: true
  }
}>

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  createComment: (userId: string, data: CreateCommentInputDTO, postId: string) => Promise <CommentDTO>
  getAllByDatePaginated: (options: CursorPagination) => Promise<PostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (postId: string) => Promise<PostDTO | null>
  getByAuthorId: (authorId: string) => Promise<PostWithReactionsAndAuthor[]>
  getAuthorIdByPostId: (postId: string) => Promise<string>
  getPostFromFollowedOrPublic: (currentUserId: string, options: CursorPagination, followedUserIds: string[], relatedPost: string) => Promise<PostWithReactionsAndAuthor[]>
  getCommentsByAuthorId: (authorId: string) => Promise<CommentDTO[]>
  getCommentsFromPost: (followedUserIds: string[], postId: string, options: CursorPagination) => Promise<PostWithReactionsAndAuthor[]>
  getCommentQty: (postId: string) => Promise<number>
  savePictures: (postId: string, images: string[]) => Promise<void>
}
