
import { ConversationDTO, ConversationViewDTO } from '@domains/conversation/dto'
import { MessageDTO } from '@domains/message/dto'

export interface ConversationService {

  getAllConversations: (userId: string) => Promise<ConversationViewDTO[]>

  getConversation: (userId: string, conversationId: string) => Promise<ConversationDTO>

  userIsMemberOfConversation: (userId: string, conversationId: string) => Promise<boolean>

  createConversation: (conversationName: string, userId: string, receivers: string[]) => Promise<ConversationDTO>

  getConversationMembersIds: (conversationId: string) => Promise<string[]>
}
