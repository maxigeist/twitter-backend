import { CreateMessageInputDTO, MessageDTO } from '@domains/message/dto'

export interface SocketService {
  createMessage: (userId: string, message: CreateMessageInputDTO) => Promise<MessageDTO>
}
