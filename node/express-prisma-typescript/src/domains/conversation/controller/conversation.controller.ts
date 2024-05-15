import { db } from '@utils'
import 'express-async-errors'
import HttpStatus from 'http-status'

import { Request, Router, Response } from 'express'
import { ConversationService, ConversationServiceImpl } from '@domains/conversation/service'
import { ConversationRepositoryImpl } from '@domains/conversation/repository/conversation.repository.impl'

export const conversationRouter = Router()

const service: ConversationService = new ConversationServiceImpl(new ConversationRepositoryImpl(db))

conversationRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const conversations = await service.getAllConversations(userId)
  return res.status(HttpStatus.OK).json(conversations)
})

conversationRouter.get('/:conversation_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { conversation_id } = req.params
  const messages = await service.getAllMessagesFromConversation(userId, conversation_id)
  return res.status(HttpStatus.OK).json(messages)
})

conversationRouter.post('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { conversationName, receivers } = req.body
  const conversation = await service.createConversation(conversationName, userId, receivers)
  return res.status(HttpStatus.CREATED).json(conversation)
})
