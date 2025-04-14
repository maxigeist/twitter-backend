import { IsNotEmpty, IsString } from 'class-validator'

export class ReactionDto {
  @IsString()
  @IsNotEmpty()
    type!: string
}

export class ExtendedReactionDto {
  constructor (reaction: ExtendedReactionDto) {
    this.userId = reaction.userId
    this.reactionTypeId = reaction.reactionTypeId
    this.postId = reaction.postId
    this.createdAt = reaction.createdAt
    this.id = reaction.id
    this.type = reaction.type
  }

  userId: string
  reactionTypeId: string
  postId: string
  createdAt: Date
  id: string
  type: string
}
