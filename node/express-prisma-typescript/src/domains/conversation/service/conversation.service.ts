
import { ConversationDTO, ConversationViewDTO } from '@domains/conversation/dto'
import { MessageDTO } from '@domains/message/dto'

export interface ConversationService {

  getAllConversations: (userId: string) => Promise<ConversationViewDTO[]>

  getAllMessagesFromConversation: (userId: string, conversationId: string) => Promise<MessageDTO[]>

  userIsMemberOfConversation: (userId: string, conversationId: string) => Promise<boolean>

  createConversation: (conversationName: string, userId: string, receivers: string[]) => Promise<ConversationDTO>

}
