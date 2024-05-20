import { CreateMessageInputDTO, MessageDTO } from '@domains/message/dto'

export interface SocketRepository {
  createMessage: (userId: string, message: CreateMessageInputDTO) => Promise<MessageDTO>
}
