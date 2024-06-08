import { CreateMessageInputDTO, MessageDTO } from '@domains/message/dto'
import { ConversationViewDTO } from '@domains/conversation/dto'

export interface SocketService {
  createMessage: (userId: string, message: CreateMessageInputDTO) => Promise<MessageDTO>
  getConversations: (userId: string) => Promise<ConversationViewDTO[]>
}
