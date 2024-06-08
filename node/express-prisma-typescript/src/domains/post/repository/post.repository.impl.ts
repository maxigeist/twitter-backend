import { PrismaClient } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository, PostWithReactionsAndAuthor } from '.'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { CommentDTO, CreateCommentInputDTO } from '@domains/comment/dto'
import { ExtendedReactionDto } from '@domains/reaction/dto'

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {
  }

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        content: data.content,
        authorId: userId,
        relatedPost: data.parentId ?? '',
        images: data.images
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

  async getById (postId: string): Promise<PostWithReactionsAndAuthor | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
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
    return post != null ? post : null
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

  async getPostFromFollowed (currentUserId: string, options: CursorPagination, followedUserIds: string[], relatedPost: string): Promise<PostWithReactionsAndAuthor[]> {
    const posts = await this.db.post.findMany({
      where: {
        AND: [
          {
            authorId: {
              in: followedUserIds
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

  async getUserReactionsFromPost (userId: string, postId: string): Promise<ExtendedReactionDto[]> {
    const userReactions = await this.db.reaction.findMany({
      where: {
        userId,
        postId
      },
      include: {
        type: {
          select: {
            type: true
          }
        }
      }
    })
    return userReactions.map((reaction) => new ExtendedReactionDto({ ...reaction, type: reaction.type.type }))
  }
}
