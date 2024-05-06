import { CommentDTO, CreateCommentInputDTO, CreatePostInputDTO, PostDTO } from '../dto'
import { PostRepository } from '../repository'
import { PostService } from '.'
import { validate } from 'class-validator'
import { ForbiddenException, NotFoundException } from '@utils'
import { CursorPagination } from '@types'

export class PostServiceImpl implements PostService {
  constructor (private readonly repository: PostRepository) {
  }

  async createPost (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    await validate(data)
    return await this.repository.create(userId, data)
  }

  async createComment (userId: string, data: CreateCommentInputDTO, postId: string): Promise<CommentDTO> {
    await validate(data)
    const post = await this.repository.getById(postId)
    if (post) {
      if (await this.checkAccessToPost(userId, post.authorId)) {
        return await this.repository.createComment(userId, data, postId)
      }
    }
    throw new NotFoundException('post')
  }

  async deletePost (userId: string, postId: string): Promise<void> {
    const post = await this.repository.getById(postId)
    if (!post) throw new NotFoundException('post')
    if (post.authorId !== userId) throw new ForbiddenException()
    await this.repository.delete(postId)
  }

  async getPost (userId: string, postId: string): Promise<PostDTO> {
    // TODO: validate that the author has public profile or the user follows the author
    const post = await this.repository.getById(postId)
    if (post) {
      await this.checkAccessToPost(userId, post.authorId)
      return post
    }
    throw new NotFoundException('post')
  }

  async getLatestPosts (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    // TODO: filter post search to return posts from authors that the user follows
    return await this.repository.getPostFromFollowedOrPublic(userId, options)
    // return await this.repository.getAllByDatePaginated(options)
  }

  async getPostsByAuthor (userId: any, authorId: string): Promise<PostDTO[]> {
    // TODO: throw exception when the author has a private profile and the user doesn't follow them
    const posts = await this.repository.getByAuthorId(authorId)
    if (posts.length > 0) {
      await this.checkAccessToPost(userId, authorId)
      return posts
    }
    return []
  }

  async checkAccessToPost (userId: string, postAuthorId: string): Promise<boolean> {
    if (
      (await this.repository.userFollows(userId, postAuthorId)) ||
      !(await this.repository.userHasPrivateAccount(postAuthorId))
    ) {
      return true
    }
    throw new ForbiddenException()
  }

  async getById (postId: string): Promise<PostDTO | null> {
    return await this.repository.getById(postId)
  }

  async getPostAuthorId (postId: string): Promise<string> {
    return await this.repository.getAuthorIdByPostId(postId)
  }
}
