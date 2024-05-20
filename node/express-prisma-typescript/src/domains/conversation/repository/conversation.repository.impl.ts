import { ConversationRepository } from '@domains/conversation/repository/conversation.repository'
import { PrismaClient } from '@prisma/client'
import { MessageDTO } from '@domains/message/dto'
import { ConversationDTO, ConversationViewDTO } from '@domains/conversation/dto'
import { UserViewDTO } from '@domains/user/dto'

export class ConversationRepositoryImpl implements ConversationRepository {
  constructor (private readonly db: PrismaClient) {}

  async createConversation (conversationName: string, receivers: string[]): Promise<ConversationDTO> {
    const conversation = await this.db.conversation.create({
      data: {
        UserConversation: {
          create: receivers.map(userId => ({ userId }))
        },
        name: conversationName
      },
      include: {
        UserConversation: {
          include: {
            user: true
          }
        }
      }
    })
    return new ConversationDTO({
      id: conversation.id,
      name: conversation.name,
      members: conversation.UserConversation.map(uc => new UserViewDTO(uc.user))
    })
  }

  async getAllMessagesFromConversation (conversationId: string): Promise<MessageDTO[]> {
    const userConversation = await this.db.userConversation.findFirst({
      where: {
        conversationId
      },
      include: {
        conversation: {
          include: {
            messages: {
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
            }
          }
        }
      }
    })
    return userConversation ? userConversation.conversation.messages.map((message) => new MessageDTO(message)) : []
  }

  async getAllConversations (userId: string): Promise<ConversationViewDTO[]> {
    const userConversations = await this.db.userConversation.findMany({
      where: {
        userId
      },
      include: {
        conversation: {
          include: {
            messages: {
              take: 1,
              orderBy: {
                createdAt: 'desc'
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
            }
          }
        }
      }
    })

    return userConversations.map(userConversation => {
      const conversation = userConversation.conversation
      return new ConversationViewDTO({ id: conversation.id, name: conversation.name, picture: conversation.picture ? conversation.picture : null, lastMessage: conversation.messages.length > 0 ? new MessageDTO(conversation.messages[0]) : null })
    })
  }

  async userIsMemberOfConversation (userId: string, conversationId: string): Promise<boolean> {
    const userConversation = await this.db.userConversation.findFirst({
      where: {
        userId,
        conversationId
      }
    })
    return !!userConversation
  }
}
