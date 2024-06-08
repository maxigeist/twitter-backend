import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'
import { db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'

export const userRouter = Router()

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db))

userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, skip } = req.query as Record<string, string>

  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(users)
})

userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const user = await service.getUser(userId, userId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.get('/profile/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: otherUserId } = req.params

  const user = await service.getUser(userId, otherUserId)

  return res.status(HttpStatus.OK).json(user)
})

userRouter.get('/search/:username', async (req: Request, res: Response) => {
  const { username } = req.params
  const { limit, before, after } = req.query as Record<string, string>
  const users = await service.getUsersByUsername(username, { limit: Number(limit), before, after })
  return res.status(HttpStatus.OK).json(users)
})

userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.deleteUser(userId)

  return res.status(HttpStatus.OK)
})

userRouter.post('/toggle/visibility', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  await service.changeVisibility(userId)
  return res.status(HttpStatus.CREATED).json({ message: 'Visibility changed successfully' })
})

userRouter.get('/upload/image', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const url = await service.saveProfilePicture(userId)
  return res.status(HttpStatus.OK).json({ url })
})
