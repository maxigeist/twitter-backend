import { CreateMessageInputDTO, MessageDTO } from '@domains/message/dto'
import { db, ForbiddenException } from '@utils'
import { SocketService } from '@domains/socket/service/socket.service'
import { SocketRepository } from '@domains/socket/repository'
import { ConversationService, ConversationServiceImpl } from '@domains/conversation/service'
import { ConversationRepositoryImpl } from '@domains/conversation/repository/conversation.repository.impl'
import { ConversationViewDTO } from '@domains/conversation/dto'

export class SocketServiceImpl implements SocketService {
  constructor (private readonly messageRepository: SocketRepository) {}

  conversationService: ConversationService = new ConversationServiceImpl(new ConversationRepositoryImpl(db))

  async createMessage (userId: string, message: CreateMessageInputDTO): Promise<MessageDTO> {
    if (!(await this.conversationService.userIsMemberOfConversation(userId, message.conversationId))) {
      throw new ForbiddenException()
    }
    return await this.messageRepository.createMessage(userId, message)
  }

  async getConversations (userId: string): Promise<ConversationViewDTO[]> {
    return await this.conversationService.getAllConversations(userId)
  }
}
