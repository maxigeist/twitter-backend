import { Request, Router, Response } from 'express'
import { FollowService, FollowServiceImpl } from '@domains/follow/service'
import { FollowRepositoryImpl } from '@domains/follow/repository'
import { db } from '@utils'
import 'express-async-errors'
import HttpStatus from 'http-status'

export const followRouter = Router()

const service: FollowService = new FollowServiceImpl(new FollowRepositoryImpl(db))

followRouter.post('/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: otherUserId } = req.params
  const follow = await service.createFollow(userId, otherUserId)
  return res.status(HttpStatus.CREATED).json(follow)
})

followRouter.delete('/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: otherUserId } = req.params
  await service.deleteFollow(userId, otherUserId)
  return res.status(HttpStatus.CREATED).json({ message: 'The user was deleted' })
})
