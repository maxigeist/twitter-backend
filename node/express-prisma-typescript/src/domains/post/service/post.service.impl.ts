import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'
import { PostRepository, PostWithReactionsAndAuthor } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException, uuidValidator } from '@utils'
import { db } from '@utils/database'
import { CursorPagination } from '@types'
import { CommentDTO, CreateCommentInputDTO } from '@domains/comment/dto'
import { FollowServiceImpl } from '@domains/follow/service'
import { FollowRepositoryImpl } from '@domains/follow/repository'
import { UserServiceImpl } from '@domains/user/service'
import { UserRepositoryImpl } from '@domains/user/repository'
import { getSignedUrlAux } from '@bucket'

export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository) {
  }

  followService: FollowServiceImpl = new FollowServiceImpl(new FollowRepositoryImpl(db))
  userService: UserServiceImpl = new UserServiceImpl(new UserRepositoryImpl((db)))

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    return await this.repository.create(userId, data)
  }

  async createComment (userId: string, data: CreateCommentInputDTO, postId: string): Promise<CommentDTO> {
    await validate(data)
    uuidValidator(postId)
    const post = await this.repository.getById(postId)
    if (post) {
      if (await this.checkAccessToPost(userId, post.authorId)) {
        return await this.repository.createComment(userId, data, postId)
      }
    }
    throw new NotFoundException('post')
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    uuidValidator(postId)
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    uuidValidator(postId)
    const post = await this.repository.getById(postId)
    if (post) {
      await this.checkAccessToPost(userId, post.authorId)
      return post
    }
    throw new NotFoundException('post')
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    this.checkPagination(options)
    const followedId = await this.followService.getUserFollowedId(userId)
    // The related post is empty because if not it is a comment.
    const posts = await this.repository.getPostFromFollowedOrPublic(userId, options, followedId, '')
    const extendedPostDTOS: ExtendedPostDTO[] = []
    for (const post of posts) {
      const qtyComments = await this.repository.getCommentQty(post.id)
      const { qtyLikes, qtyRetweets } = this.countReactions(post)
      extendedPostDTOS.push({ id: post.id, authorId: post.authorId, content: post.content, images: post.images, createdAt: post.createdAt, author: post.author, qtyComments, qtyLikes, qtyRetweets })
    }
    return extendedPostDTOS
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<ExtendedPostDTO[]> {
    uuidValidator(authorId)
    await this.checkAccessToPost(userId, authorId)
    const posts = await this.repository.getByAuthorId(authorId)
    const extendedPostDTOS: ExtendedPostDTO[] = []

    if (posts.length > 0) {
      for (const post of posts) {
        const qtyComments = await this.repository.getCommentQty(post.id)
        const { qtyLikes, qtyRetweets } = this.countReactions(post)
        extendedPostDTOS.push({ id: post.id, authorId: post.authorId, content: post.content, images: post.images, createdAt: post.createdAt, author: post.author, qtyComments, qtyLikes, qtyRetweets })
      }
      return extendedPostDTOS
    }
    return []
  }

  async checkAccessToPost (userId: string, postAuthorId: string): Promise<boolean> {
    if (
      userId === postAuthorId ||
      (await this.followService.userFollows(userId, postAuthorId)) ||
      !(await this.userService.userHasPrivateAccount(postAuthorId))
    ) {
      return true
    }
    throw new ForbiddenException()
  }

  async getCommentsByUser (userId: string, authorId: string): Promise<CommentDTO[]> {
    uuidValidator(authorId)
    await this.checkAccessToPost(userId, authorId)
    return await this.repository.getCommentsByAuthorId(authorId)
  }

  async getCommentsByPost (userId: string, options: CursorPagination, postId: string): Promise<ExtendedPostDTO[]> {
    uuidValidator(postId)
    this.checkPagination(options)
    const post = await this.repository.getById(postId)
    if (post) {
      const followedId = await this.followService.getUserFollowedId(userId)
      await this.checkAccessToPost(userId, post.authorId)
      const comments = await this.repository.getCommentsFromPost(followedId, postId, options)
      const extendedPostDTOS: ExtendedPostDTO[] = []
      for (const comment of comments) {
        const qtyComments = await this.repository.getCommentQty(comment.id)
        const { qtyLikes, qtyRetweets } = this.countReactions(comment)
        extendedPostDTOS.push({ id: comment.id, authorId: comment.authorId, content: comment.content, images: comment.images, createdAt: comment.createdAt, author: comment.author, qtyComments, qtyLikes, qtyRetweets })
      }
      return extendedPostDTOS
    }
    throw new NotFoundException('post')
  }

  async uploadPicturesToPost (userId: string, postId: string, images: number): Promise<string[]> {
    uuidValidator(postId)
    const post = await this.repository.getById(postId)
    if (post) {
      if (post.authorId !== userId) throw new ForbiddenException()
      const urls: string[] = []
      const imagesAux: string[] = []
      for (let i = 0; i < images; i++) {
        urls.push(await getSignedUrlAux(postId + '-post-picture-' + i.toString()))
        imagesAux.push(postId + '-post-picture-' + i.toString())
      }
      await this.repository.savePictures(postId, imagesAux)
      return urls
    }
    throw new NotFoundException('post')
  }

  countReactions (comment: PostWithReactionsAndAuthor): { qtyLikes: number, qtyRetweets: number } {
    let qtyLikes = 0
    let qtyRetweets = 0
    for (const commentElement of comment.reactions) {
      if (commentElement.type.type === 'like') {
        qtyLikes++
      } else if (commentElement.type.type === 'retweet') {
        qtyRetweets++
      }
    }
    return { qtyLikes, qtyRetweets }
  }

  checkPagination (options: CursorPagination): void {
    if (options.before) {
      uuidValidator(options.before)
    }
    if (options.after) {
      uuidValidator(options.after)
    }
  }
}
