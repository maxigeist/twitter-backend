import { prismaMock } from './config'
import { PostServiceImpl } from '../domains/post/service'
import { PostRepositoryImpl } from '../domains/post/repository'
import { ForbiddenException, NotFoundException } from '../utils'
import { beforeAll, describe } from '@jest/globals'
import { db } from '../utils/database'
let user: { id: string, name: string, email: string, password: string, username: string, profilePicture: string | null, createdAt: Date, updatedAt: Date, deletedAt: Date }
let user2: { id: string, name: string, email: string, password: string, username: string, profilePicture: string | null, createdAt: Date, updatedAt: Date, deletedAt: Date }
let post: { id: string
  authorId: string
  content: string
  images: string[]
  createdAt: Date
  relatedPost: string
  updatedAt: Date
  deletedAt: Date
}
let comment: { id: string, authorId: string, relatedPost: string, content: string, images: string[], createdAt: Date, updatedAt: Date, deletedAt: Date }
let follow: { id: string, followerId: string, followedId: string, createdAt: Date, updatedAt: Date, deletedAt: Date }
const date = new Date()
let profileVisibility: { id: string, userId: string, profileTypeId: string }
const postRepositoryImpl = new PostRepositoryImpl(db)
const postServiceImpl = new PostServiceImpl(postRepositoryImpl)
describe('Post tests', () => {
  beforeAll(async () => {
    user = {
      id: '59ffd7fb-ea8e-47c0-b36a-8461a5526f6d',
      name: 'Rich',
      email: 'hello@prisma.io',
      password: 'MepasQlt14092#%',
      username: 'Rich123',
      profilePicture: null,
      createdAt: date,
      updatedAt: date,
      deletedAt: date
    }
    user2 = {
      id: '66dc2de7-23da-49e8-a224-7e83e1dad3b0',
      name: 'Mike',
      email: 'goodbye@prisma.io',
      password: 'MepasQlt14092#%',
      username: 'Mike123',
      profilePicture: null,
      createdAt: date,
      updatedAt: date,
      deletedAt: date
    }
    post = {
      id: 'fd592d0f-e414-44dd-bc8d-5b23eb7f51dd',
      authorId: user2.id,
      content: 'Hello world',
      images: [],
      createdAt: date,
      relatedPost: '',
      updatedAt: date,
      deletedAt: date
    }
    comment = {
      id: 'fd592d0f-e414-44dd-bc8d-5b23eb7f51dd',
      authorId: user.id,
      relatedPost: post.id,
      content: 'Hello world',
      images: [],
      createdAt: date,
      updatedAt: date,
      deletedAt: date
    }
    follow = {
      id: '59ffd7fb-ea8e-47c0-b36a-8461a5526f6d',
      followerId: user.id,
      followedId: user2.id,
      createdAt: date,
      updatedAt: date,
      deletedAt: date
    }
    profileVisibility = {
      id: '59ffd7fb-ea8e-47c0-b36a-8461a5526f6d',
      userId: user.id,
      profileTypeId: '59ffd7fb-ea8e-47c0-b36a-8461a5526f6d'
    }
  })

  test('should return a post by id', async () => {
    prismaMock.follow.findFirst.mockResolvedValue(follow)
    prismaMock.post.findUnique.mockResolvedValue(post)
    await expect(postServiceImpl.getPost(user.id, post.id)).resolves.toEqual(
      {
        id: post.id,
        authorId: post.authorId,
        content: post.content,
        images: post.images,
        createdAt: post.createdAt
      }
    )
  })
  test('should not return a post if the user does not follow and the profile is private', async () => {
    prismaMock.post.findUnique.mockResolvedValue(post)
    prismaMock.follow.findFirst.mockResolvedValue(null)
    prismaMock.profileVisibility.findFirst.mockResolvedValue(profileVisibility)
    await expect(postServiceImpl.getPost(user.id, post.id)).rejects.toEqual(new ForbiddenException())
  })
  test('should not return a post if the post does not exist', async () => {
    prismaMock.post.findUnique.mockResolvedValue(null)
    await expect(postServiceImpl.getPost(user.id, post.id)).rejects.toEqual(new NotFoundException('post'))
  })

  test('should return comments if the user has a public profile and the ', async () => {
    prismaMock.follow.findFirst.mockResolvedValue(null)
    prismaMock.profileVisibility.findFirst.mockResolvedValue(null)
    prismaMock.post.findMany.mockResolvedValue([comment])
    await expect(postServiceImpl.getCommentsByUser(user.id, user2.id)).resolves.toEqual(
      [
        {
          id: comment.id,
          authorId: comment.authorId,
          content: comment.content,
          images: comment.images,
          createdAt: comment.createdAt
        }
      ]
    )
  })

  test('cant create a comment if the post does not exist', async () => {
    prismaMock.post.findUnique.mockResolvedValue(null)
    await expect(postServiceImpl.createComment(user.id, comment, post.id)).rejects.toEqual(new NotFoundException('post'))
  })
})
