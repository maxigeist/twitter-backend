import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient } from '@prisma/client'
import { CursorPagination, OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'
import { UserRepository } from './user.repository'

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (data: SignupInputDTO): Promise<UserDTO> {
    return await this.db.user.create({
      data: {
        ...data,
        profileVisibility: {
          create: {
            type: {
              connectOrCreate: {
                where: {
                  type: 'public'
                },
                create: {
                  type: 'public'
                }
              }
            }
          }
        }
      }
    }).then(user => new UserDTO(user))
  }

  async getById (userId: any): Promise<UserViewDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    return user ? new UserViewDTO(user) : null
  }

  async delete (userId: any): Promise<void> {
    await this.db.user.delete({
      where: {
        id: userId
      }
    })
  }

  async userHasPrivateAccount (userId: string): Promise<boolean> {
    return await this.db.profileVisibility
      .findFirst({
        where: {
          userId,
          type: {
            type: 'private'
          }
        }
      })
      .then((profile) => Boolean(profile))
  }

  async getRecommendedUsersPaginated (userId: string[], options: OffsetPagination): Promise<UserViewDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      where: {
        id: {
          in: userId
        }
      },
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new UserViewDTO(user))
  }

  async getByEmailOrUsername (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    const user = await this.db.user.findFirst({
      where: {
        OR: [
          {
            email
          },
          {
            username
          }
        ]
      }
    })
    return user ? new ExtendedUserDTO(user) : null
  }

  async getUsersByUsername (username: string, options: CursorPagination): Promise<UserViewDTO[]> {
    const users = await this.db.user.findMany({
      cursor: options.after ? { id: options.after } : options.before ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      where: {
        username: {
          startsWith: username
        }
      },
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new UserViewDTO(user))
  }

  async getUserById (userId: string): Promise<UserViewDTO | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })
    return user ? new UserViewDTO(user) : null
  }

  async changeVisibility (userId: string, type: string): Promise<void> {
    await this.db.profileVisibility.update({
      where: {
        userId
      },
      data: {
        type: {
          connect: {
            type
          }
        }
      }
    })
  }

  async savePicture (userId: string, imageName: string): Promise<void> {
    await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        profilePicture: imageName
      }
    })
  }
}
