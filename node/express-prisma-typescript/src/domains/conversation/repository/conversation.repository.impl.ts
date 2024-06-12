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
          create: receivers.map((userId) => ({ userId }))
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
      messages: [],
      members: conversation.UserConversation.map((uc) => new UserViewDTO(uc.user))
    })
  }

  async getConversation (conversationId: string, userId: string): Promise<ConversationDTO> {
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
              },
              orderBy: {
                createdAt: 'desc'
              }
            },
            UserConversation: {
              include: {
                user: true
              }
            }
          }
        }
      }
    })
    return userConversation
      ? new ConversationDTO(
        {
          id: userConversation.conversation.id,
          name: Number(userConversation.conversation.UserConversation.length) > 2
            ? userConversation.conversation.name
            : userConversation.conversation.UserConversation.find((uc) => uc.userId !== userId)?.user.username ?? '',
          members: userConversation.conversation.UserConversation.map((uc) => new UserViewDTO(uc.user)),
          messages: userConversation.conversation.messages.map((message) => new MessageDTO(message))
        }
      )
      : new ConversationDTO({ id: '', name: '', members: [], messages: [] })
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
            },
            UserConversation: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true
                  }
                }
              }
            }
          }
        }
      }
    })

    return userConversations.map((userConversation) => {
      const conversation = userConversation.conversation
      return new ConversationViewDTO({
        id: conversation.id,
        name:
          Number(conversation.UserConversation.length) > 2
            ? conversation.name
            : conversation.UserConversation.find((uc) => uc.userId !== userId)?.user.username ?? '',
        picture: conversation.picture ? conversation.picture : null,
        lastMessage: conversation.messages.length > 0 ? new MessageDTO(conversation.messages[0]) : null
      })
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

  async getConversationByReceiverIds (receiverIds: string[]): Promise<boolean> {
    const conversation = await this.db.conversation.findFirst({
      where: {
        UserConversation: {
          every: {
            userId: {
              in: receiverIds
            }
          }
        }
      }
    })
    return Boolean(conversation)
  }

  async getConversationMembersIds (conversationId: string): Promise<string[]> {
    const userConversations = await this.db.userConversation.findMany({
      where: {
        conversationId
      }
    })
    return userConversations.map((uc) => uc.userId)
  }
}
