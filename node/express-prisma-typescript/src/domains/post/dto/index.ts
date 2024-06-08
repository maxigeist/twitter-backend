import { IsNotEmpty, IsString, MaxLength } from 'class-validator'
import { ExtendedUserDTO } from '@domains/user/dto'
import { ExtendedReactionDto } from '@domains/reaction/dto'

export class CreatePostInputDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
    content!: string

  @IsString()
    parentId?: string

  @IsString({ each: true })
    images?: string[]
}

// They could use the same but it makes no sense because the comment may have a longer length

export class PostDTO {
  constructor (post: PostDTO) {
    this.id = post.id
    this.authorId = post.authorId
    this.content = post.content
    this.images = post.images
    this.createdAt = post.createdAt
  }

  id: string
  authorId: string
  content: string
  images: string[]
  createdAt: Date
}

export class ExtendedPostDTO extends PostDTO {
  constructor (post: ExtendedPostDTO) {
    super(post)
    this.author = post.author
    this.qtyComments = post.qtyComments
    this.qtyLikes = post.qtyLikes
    this.qtyRetweets = post.qtyRetweets
    this.userReactions = post.userReactions
  }

  author!: ExtendedUserDTO
  qtyComments!: number
  qtyLikes!: number
  qtyRetweets!: number
  userReactions!: ExtendedReactionDto[]
}
