import { ConversationService } from '@domains/conversation/service/conversation.service'
import { ConversationDTO, ConversationViewDTO } from '@domains/conversation/dto'
import { MessageDTO } from '@domains/message/dto'
import { ConversationRepository } from '@domains/conversation/repository/conversation.repository'
import { FollowService, FollowServiceImpl } from '@domains/follow/service'
import { FollowRepositoryImpl } from '@domains/follow/repository'
import { db, ForbiddenException } from '@utils'
import { UserService, UserServiceImpl } from '@domains/user/service'
import { UserRepositoryImpl } from '@domains/user/repository'

export class ConversationServiceImpl implements ConversationService {
  constructor (private readonly conversationRepository: ConversationRepository) {
  }

  followService: FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db))
  userService: UserService = new UserServiceImpl(new UserRepositoryImpl(db))

  async getAllConversations (userId: string): Promise<ConversationViewDTO[]> {
    return await this.conversationRepository.getAllConversations(userId)
  }

  async getAllMessagesFromConversation (userId: string, conversationId: string): Promise<MessageDTO[]> {
    if (!await this.conversationRepository.userIsMemberOfConversation(userId, conversationId)) {
      throw new ForbiddenException()
    }
    return await this.conversationRepository.getAllMessagesFromConversation(conversationId)
  }

  async createConversation (conversationName: string, userId: string, receivers: string[]): Promise<ConversationDTO> {
    let conversationNameAux = conversationName
    for (const receiver of receivers) {
      if (!await this.followService.userFollows(userId, receiver)) {
        throw new ForbiddenException()
      }
    }
    if (receivers.length === 1) {
      const user = await this.userService.getUserById(receivers[0])
      if (user?.username) {
        conversationNameAux = user.username
      }
    }
    receivers.push(userId)
    return await this.conversationRepository.createConversation(conversationNameAux, receivers)
  }

  async userIsMemberOfConversation (userId: string, conversationId: string): Promise<boolean> {
    return await this.conversationRepository.userIsMemberOfConversation(userId, conversationId)
  }
}
