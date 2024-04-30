import { ExtendedFollowDto, FollowDTO } from '@domains/follow/dto'

export interface FollowRepository {
  create: (follow: FollowDTO) => Promise<ExtendedFollowDto>

  delete: (followerId: string, followedId: string) => Promise<void>
}
