import { PrismaClient } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository, PostWithReactionsAndAuthor } from '.'
import { CreatePostInputDTO, PostDTO } from '../dto'
import { CommentDTO, CreateCommentInputDTO } from '@domains/comment/dto'

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        relatedPost: '',
        ...data
      }
    })
    return new PostDTO(post)
  }

  async createComment (userId: string, data: CreateCommentInputDTO, postId: string): Promise<CommentDTO> {
    const comment = await this.db.post.create({
      data: {
        authorId: userId,
        relatedPost: postId,
        ...data
      }
    })
    return new CommentDTO(comment)
  }

  async getAllByDatePaginated (options: CursorPagination, authorId?: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : options.before ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })
    return posts.map((post) => new PostDTO(post))
  }

  async delete (postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }

  async getById (postId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      }
    })
    return post != null ? new PostDTO(post) : null
  }

  // async getAuthorId(postId: string): Promise<string | null>{
  //   const authorId = await this.db.post.find
  // }

  async getByAuthorId (authorId: string): Promise<PostWithReactionsAndAuthor[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId,
        relatedPost: ''
      },
      include: {
        reactions: {
          select: {
            type: true
          }
        },
        author: true
      }
    })
    return posts
  }

  async getPostFromFollowedOrPublic (currentUserId: string, options: CursorPagination, followedUserIds: string[], relatedPost: string): Promise<PostWithReactionsAndAuthor[]> {
    const posts = await this.db.post.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                author: {
                  profileVisibility: {
                    type: {
                      type: 'public'
                    }
                  }
                }
              },
              {
                NOT: {
                  authorId: currentUserId
                }
              },
              {
                relatedPost
              }
            ]
          },
          {
            authorId: {
              in: followedUserIds
            },
            relatedPost
          }
        ]
      },
      include: {
        reactions: {
          select: {
            type: true
          }
        },
        author: true
      },
      cursor: options.after ? { id: options.after } : options.before ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })
    return posts
  }

  async getCommentsFromPost (followedUserIds: string[], postId: string, options: CursorPagination): Promise<PostWithReactionsAndAuthor[]> {
    const comments = await this.db.post.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                author: {
                  profileVisibility: {
                    type: {
                      type: 'public'
                    }
                  }
                }
              },
              {
                relatedPost: postId
              }
            ]
          },
          {
            authorId: {
              in: followedUserIds
            },
            relatedPost: postId
          }
        ]
      },
      include: {
        reactions: {
          select: {
            type: true
          }
        },
        author: true
      },
      cursor: options.after ? { id: options.after } : options.before ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          reactions: {
            _count: 'desc'
          }
        }
      ]
    })
    return comments
  }

  async getAuthorIdByPostId (postId: string): Promise<string> {
    return await this.db.post.findUnique({
      where: {
        id: postId
      },
      select: {
        authorId: true
      }
    }).then((post) => post?.authorId ?? '')
  }

  async getCommentsByAuthorId (authorId: string): Promise<CommentDTO[]> {
    const comments = await this.db.post.findMany({
      where: {
        authorId,
        relatedPost: {
          not: ''
        }
      }
    })
    return comments.map((comment) => new CommentDTO(comment))
  }

  async getCommentQty (postId: string): Promise<number> {
    const qtyComments = await this.db.post.count({
      where: {
        relatedPost: postId
      }
    })
    return qtyComments
  }

  async savePictures (postId: string, images: string[]): Promise<void> {
    await this.db.post.update({
      where: {
        id: postId
      },
      data: {
        images
      }
    })
  }
}
