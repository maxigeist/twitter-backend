import { IsNotEmpty, IsString } from 'class-validator'
import { UserViewDTO } from '@domains/user/dto'

export class CreateMessageInputDTO {
  @IsString()
  @IsNotEmpty()
    content!: string

  @IsString()
  @IsNotEmpty()
    conversationId!: string
}

export class MessageDTO {
  constructor (message: MessageDTO) {
    this.id = message.id
    this.sender = message.sender
    this.conversationId = message.conversationId
    this.content = message.content
    this.createdAt = message.createdAt
  }

  id: string
  sender: UserViewDTO
  conversationId: string
  content: string
  createdAt: Date
}
