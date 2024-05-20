import { ConversationDTO, ConversationViewDTO } from '@domains/conversation/dto'
import { MessageDTO } from '@domains/message/dto'

export interface ConversationRepository {

  getAllConversations: (userId: string) => Promise<ConversationViewDTO[]>

  getAllMessagesFromConversation: (conversationId: string) => Promise<MessageDTO[]>

  userIsMemberOfConversation: (userId: string, conversationId: string) => Promise<boolean>

  createConversation: (conversationName: string, receivers: string[]) => Promise<ConversationDTO>

}
