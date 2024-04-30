import { IsNotEmpty, IsString } from 'class-validator'

export class FollowDTO {
  constructor (follow: FollowDTO) {
    this.followerId = follow.followerId
    this.followedId = follow.followedId
  }

  @IsString()
  @IsNotEmpty()
    followerId: string

  @IsString()
  @IsNotEmpty()
    followedId: string
}

export class ExtendedFollowDto {
  constructor (follow: ExtendedFollowDto) {
    this.followerId = follow.followerId
    this.followedId = follow.followedId
    this.createdAt = follow.createdAt
    this.id = follow.id
  }

  followerId: string
  followedId: string
  createdAt: Date
  id: string
}
