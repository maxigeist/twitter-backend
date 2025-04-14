import { IsArray, IsNotEmpty, IsString } from 'class-validator'
import { MessageDTO } from '@domains/message/dto'
import { UserViewDTO } from '@domains/user/dto'
import { Message } from '@prisma/client'

export class CreateConversationInputDTO {
  @IsString()
    conversationName?: string

  @IsArray()
  @IsNotEmpty()
    receivers!: string[]
}

export class ConversationDTO {
  constructor (conversation: ConversationDTO) {
    this.id = conversation.id
    this.name = conversation.name
    this.messages = conversation.messages
    this.members = conversation.members
  }

  id: string
  name: string
  messages: MessageDTO[]
  members: UserViewDTO[]
}

export class ConversationViewDTO {
  constructor (conversation: ConversationViewDTO) {
    this.id = conversation.id
    this.name = conversation.name
    this.lastMessage = conversation.lastMessage
    this.picture = conversation.picture
  }

  id: string
  name: string
  lastMessage: MessageDTO | null
  picture: string | null
}
