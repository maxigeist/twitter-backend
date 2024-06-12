import { ConversationService } from '@domains/conversation/service/conversation.service'
import { ConversationDTO, ConversationViewDTO } from '@domains/conversation/dto'
import { ConversationRepository } from '@domains/conversation/repository/conversation.repository'
import { FollowService, FollowServiceImpl } from '@domains/follow/service'
import { FollowRepositoryImpl } from '@domains/follow/repository'
import { ConflictException, db, ForbiddenException, uuidValidator } from '@utils'
import { UserService, UserServiceImpl } from '@domains/user/service'
import { UserRepositoryImpl } from '@domains/user/repository'

export class ConversationServiceImpl implements ConversationService {
  constructor (private readonly conversationRepository: ConversationRepository) {}

  followService: FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db))
  userService: UserService = new UserServiceImpl(new UserRepositoryImpl(db))

  async getAllConversations (userId: string): Promise<ConversationViewDTO[]> {
    return await this.conversationRepository.getAllConversations(userId)
  }

  async getConversation (userId: string, conversationId: string): Promise<ConversationDTO> {
    uuidValidator(conversationId)
    if (!(await this.conversationRepository.userIsMemberOfConversation(userId, conversationId))) {
      throw new ForbiddenException()
    }
    return await this.conversationRepository.getConversation(conversationId, userId)
  }

  async createConversation (conversationName: string, userId: string, receivers: string[]): Promise<ConversationDTO> {
    let conversationNameAux = conversationName
    if (receivers.length === 1) {
      uuidValidator(receivers[0])
      if (await this.conversationRepository.getConversationByReceiverIds([userId, receivers[0]])) {
        throw new ConflictException('CONVERSATION ALREADY EXISTS')
      } else {
        const user = await this.userService.getUser(userId, receivers[0])
        if (user?.username) {
          conversationNameAux = user.username
        }
      }
    }
    for (const receiver of receivers) {
      uuidValidator(receiver)
      if (!(await this.followService.userFollows(userId, receiver))) {
        throw new ForbiddenException()
      }
    }
    return await this.conversationRepository.createConversation(conversationNameAux, [userId, ...receivers])
  }

  async userIsMemberOfConversation (userId: string, conversationId: string): Promise<boolean> {
    return await this.conversationRepository.userIsMemberOfConversation(userId, conversationId)
  }

  async getConversationMembersIds (conversationId: string): Promise<string[]> {
    return await this.conversationRepository.getConversationMembersIds(conversationId)
  }
}
