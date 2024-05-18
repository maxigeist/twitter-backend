import { CreateMessageInputDTO, MessageDTO } from '@domains/message/dto'
import { UserService, UserServiceImpl } from '@domains/user/service'
import { UserRepositoryImpl } from '@domains/user/repository'
import { db } from '@utils'
import { FollowService, FollowServiceImpl } from '@domains/follow/service'
import { FollowRepositoryImpl } from '@domains/follow/repository'
import { SocketService } from '@domains/socket/service/socket.service'
import { SocketRepository } from '@domains/socket/repository'

export class SocketServiceImpl implements SocketService {
  constructor (private readonly messageRepository: SocketRepository) {
  }

  userService: UserService = new UserServiceImpl(new UserRepositoryImpl(db))
  followService: FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db))

  async createMessage (userId: string, message: CreateMessageInputDTO): Promise<MessageDTO> {
    return await this.messageRepository.createMessage(userId, message)
  }
}
