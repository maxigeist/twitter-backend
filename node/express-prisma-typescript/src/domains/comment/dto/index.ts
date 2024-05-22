import { IsNotEmpty, IsString, MaxLength } from 'class-validator'

export class CommentDTO {
  constructor (comment: CommentDTO) {
    this.id = comment.id
    this.authorId = comment.authorId
    this.content = comment.content
    this.images = comment.images
    this.createdAt = comment.createdAt
  }

  id: string
  authorId: string
  content: string
  images: string[]
  createdAt: Date
}

export class CreateCommentInputDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
    content!: string
}
