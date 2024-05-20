import { IsArray, IsNotEmpty, IsString } from 'class-validator'
import { MessageDTO } from '@domains/message/dto'
import { UserViewDTO } from '@domains/user/dto'

export class CreateConversationInputDTO {
  @IsString()
  @IsNotEmpty()
    content!: string

  @IsArray()
  @IsNotEmpty()
    receivers!: string[]
}

export class ConversationDTO {
  constructor (conversation: ConversationDTO) {
    this.id = conversation.id
    this.name = conversation.name
    this.members = conversation.members
  }

  id: string
  name: string
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
