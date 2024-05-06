import { Request, Router, Response } from 'express'
import { BodyValidation } from '@utils'
import 'express-async-errors'
import HttpStatus from 'http-status'
import { CommentService, CommentServiceImpl } from '@domains/comment/service'
import { CreateCommentInputDTO } from '@domains/comment/dto'

export const commentRouter = Router()
const service: CommentService = new CommentServiceImpl()

commentRouter.post('/:postId', BodyValidation(CreateCommentInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body
  const { postId: relatedPostId } = req.params

  const comment = await service.createComment(userId, data, relatedPostId)

  return res.status(HttpStatus.CREATED).json(comment)
})

commentRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: authorId } = req.params

  const comments = await service.getCommentsByUser(userId, authorId)
  return res.status(HttpStatus.CREATED).json(comments)
})
