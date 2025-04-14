import { Request, Router, Response } from 'express'
import { ReactionService, ReactionServiceImpl } from '@domains/reaction/service'
import { BodyValidation, db } from '@utils'
import { ReactionRepositoryImpl } from '@domains/reaction/repository'
import 'express-async-errors'
import HttpStatus from 'http-status'
import { ReactionDto } from '@domains/reaction/dto'

export const reactionRouter = Router()
const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db))

reactionRouter.post('/:post_id', BodyValidation(ReactionDto), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { post_id } = req.params
  const { type } = req.body
  const reaction = await service.createReaction(userId, type, post_id)
  return res.status(HttpStatus.CREATED).json(reaction)
})

reactionRouter.delete('/:reaction_id', async (req: Request, res: Response) => {
  const { reaction_id } = req.params
  await service.deleteReaction(reaction_id)
  return res.status(HttpStatus.NO_CONTENT).json()
})

reactionRouter.get('/like/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: otherId } = req.params
  const likes = await service.getLikesFromUser(userId, otherId)
  return res.status(HttpStatus.OK).json(likes)
})

reactionRouter.get('/retweet/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: otherId } = req.params
  const retweets = await service.getRetweetsFromUser(userId, otherId)
  return res.status(HttpStatus.OK).json(retweets)
})
