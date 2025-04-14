import { ConversationDTO, ConversationViewDTO } from '@domains/conversation/dto'

export interface ConversationRepository {

  getAllConversations: (userId: string) => Promise<ConversationViewDTO[]>

  getConversation: (conversationId: string, userId: string) => Promise<ConversationDTO>

  userIsMemberOfConversation: (userId: string, conversationId: string) => Promise<boolean>

  createConversation: (conversationName: string, receivers: string[]) => Promise<ConversationDTO>

  getConversationByReceiverIds: (receiverIds: string[]) => Promise<boolean>

  getConversationMembersIds: (conversationId: string) => Promise<string[]>

}
