import { CreateMessageInputDTO, MessageDTO } from '@domains/message/dto'
import { PrismaClient } from '@prisma/client'
import { SocketRepository } from '@domains/socket/repository/socket.repository'

export class SocketRepositoryImpl implements SocketRepository {
  constructor (private readonly db: PrismaClient) {}

  async createMessage (userId: string, message: CreateMessageInputDTO): Promise<MessageDTO> {
    const createdMessage = await this.db.message.create({
      data: {
        senderId: userId,
        content: message.content,
        conversationId: message.conversationId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            name: true,
            profilePicture: true
          }
        }
      }
    })

    return new MessageDTO(createdMessage)
  }
}
