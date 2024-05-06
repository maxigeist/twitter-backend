import { ExtendedFollowDto } from '@domains/follow/dto'

export interface FollowService {
  createFollow: (followerId: string, followedId: string) => Promise<ExtendedFollowDto>
  deleteFollow: (followerId: string, followedId: string) => Promise<void>
  getUserFollowedId: (followerId: string) => Promise<string[]>
}
