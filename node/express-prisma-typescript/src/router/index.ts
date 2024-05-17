import { Router } from 'express'
import { withAuth } from '@utils'

import { userRouter } from '@domains/user'
import { postRouter } from '@domains/post'
import { authRouter } from '@domains/auth'
import { healthRouter } from '@domains/health'
import { followRouter } from '@domains/follow'
import { commentRouter } from '@domains/comment'
import { reactionRouter } from '@domains/reaction'

export const router = Router()

router.use('/health', healthRouter)
router.use('/auth', authRouter)
router.use('/user', withAuth, userRouter)
router.use('/post', withAuth, postRouter)
router.use('/follow', withAuth, followRouter)
router.use('/reaction', withAuth, reactionRouter)
router.use('/comment', withAuth, commentRouter)
