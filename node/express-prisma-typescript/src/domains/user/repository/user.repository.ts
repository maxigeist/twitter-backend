import { SignupInputDTO } from '@domains/auth/dto'
import { CursorPagination, OffsetPagination } from '@types'
import { ExtendedUserDTO, UserDTO, UserViewDTO } from '../dto'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (userId: string[], options: OffsetPagination) => Promise<UserViewDTO[]>
  getById: (userId: string) => Promise<UserViewDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  getUsersByUsername: (username: string, options: CursorPagination) => Promise<UserViewDTO[]>
  userHasPrivateAccount: (userId: string) => Promise<boolean>
  getUserById: (userId: string) => Promise<UserViewDTO | null>
  changeVisibility: (userId: string, type: string) => Promise<void>
  savePicture: (userId: string, imageName: string) => Promise<void>
}
