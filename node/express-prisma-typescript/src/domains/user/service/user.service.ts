import { CursorPagination, OffsetPagination } from '@types'
import { UserViewDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: string, otherUserId: any) => Promise<UserViewDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserViewDTO[]>
  getUsersByUsername: (username: string, options: CursorPagination) => Promise<UserViewDTO[]>
  userHasPrivateAccount: (userId: string) => Promise<boolean>
}
