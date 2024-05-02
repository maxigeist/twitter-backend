import { PrismaClient } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, PostDTO } from '../dto'

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {
  }

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async getAllByDatePaginated (options: CursorPagination, authorId?: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
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
    return posts.map(post => new PostDTO(post))
  }

  async delete (postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }

  async userFollows (currentUserId: string, authorId: string): Promise<boolean> {
    return await this.db.follow.findFirst({
      where: {
        followerId: currentUserId,
        followedId: authorId
      },
      select: {
        id: true
      }
    }).then(id => !!id)
  }

  async userHasPrivateAccount (authorId: string): Promise<boolean> {
    return await this.db.profileVisibility.findFirst({
      where: {
        userId: authorId,
        type: {
          type: 'private'
        }
      }
    }).then(profile => (Boolean(profile)))
  }

  async getById (postId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      }
    })
    return (post != null) ? new PostDTO(post) : null
  }

  async getByAuthorId (authorId: string): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
        authorId
      }
    })
    return posts.map(post => new PostDTO(post))
  }

  async getPostFromFollowedOrPublic (currentUserId: string, options: CursorPagination): Promise<PostDTO[]> {
    const follows = await this.db.follow.findMany({
      where: {
        followerId: currentUserId
      },
      select: {
        followedId: true
      }
    })
    const followedUserIds = follows.map(follow => follow.followedId)
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
              }
            ]
          },
          {
            authorId: {
              in: followedUserIds
            }
          }
        ]
      },
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
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
    // Map posts to PostDTO
    return posts.map(post => new PostDTO(post))
  }
}
