import { Request, Router, Response } from 'express'
import { ReactionService, ReactionServiceImpl } from '@domains/reaction/service'
import { db } from '@utils'
import { ReactionRepositoryImpl } from '@domains/reaction/repository'
import 'express-async-errors'
import HttpStatus from 'http-status'

export const reactionRouter = Router()
const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db))

reactionRouter.post('/:post_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { post_id } = req.params
  const { reactionType } = req.body
  const reaction = await service.createReaction(userId, reactionType, post_id)
  console.log(reaction)
  return res.status(HttpStatus.CREATED).json(reaction)
})

reactionRouter.delete('/:post_id', async (req: Request, res: Response) => {
  const { post_id } = req.params
  const { reactionId } = req.body
  await service.deleteReaction(reactionId, post_id)
  return res.sendStatus(HttpStatus.NO_CONTENT)
})
