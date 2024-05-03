import { Request, Router, Response } from 'express';
import { ReactionService, ReactionServiceImpl } from '@domains/reaction/service';
import { db } from '@utils';
import { ReactionRepositoryImpl } from '@domains/reaction/repository';
import 'express-async-errors';
import HttpStatus from 'http-status';
import { PostService, PostServiceImpl } from '@domains/post/service';
import { PostRepositoryImpl } from '@domains/post/repository';
import { PermissionService } from '@domains/permission/service/permission.service';
import { PermissionServiceImpl } from '@domains/permission/service/permission.service.impl';
import { PermissionRepositoryImpl } from '@domains/permission/repository/permission.repository.impl';

export const reactionRouter = Router()
const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db))

reactionRouter.post('/:post_id', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { post_id } = req.params
  const { reactionTypeId } = req.body
  const reaction = await service.createReaction(userId, reactionTypeId, post_id)
  console.log(reaction)
  return res.status(HttpStatus.CREATED).json(reaction)
});

reactionRouter.delete('/:post_id', async (req: Request, res: Response) => {
  const { post_id } = req.params
  await service.deleteReaction(post_id)
  return res.sendStatus(HttpStatus.NO_CONTENT)
})
