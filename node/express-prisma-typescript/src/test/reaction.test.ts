import { ReactionRepositoryImpl } from '../domains/reaction/repository'
import { ReactionServiceImpl } from '../domains/reaction/service'
import { ForbiddenException, NotFoundException } from '../utils'
import { prismaMock } from './config'
import { beforeAll, describe } from '@jest/globals'
import { db } from '../utils/database'

let user: { id: string, name: string, email: string, password: string, username: string, profilePicture: string | null, createdAt: Date, updatedAt: Date, deletedAt: Date }
let user2: { id: string, name: string, email: string, password: string, username: string, profilePicture: string | null, createdAt: Date, updatedAt: Date, deletedAt: Date }
let reactionType: { id: string, type: string }
let follow: { id: string, followerId: string, followedId: string, createdAt: Date, updatedAt: Date, deletedAt: Date }
let post: { id: string
  authorId: string
  content: string
  images: string[]
  createdAt: Date
  relatedPost: string
  updatedAt: Date
  deletedAt: Date
}
let reaction: { id: string, userId: string, postId: string, reactionTypeId: string, createdAt: Date, updatedAt: Date, deletedAt: Date }
let profileVisibility: { id: string, userId: string, profileTypeId: string }
const date = new Date()
describe('Reaction tests', () => {
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
    reactionType = {
      id: '021277be-c639-4b54-80ac-33164ffd94e6',
      type: 'like'
    }
    post = {
      id: 'fd592d0f-e414-44dd-bc8d-5b23eb7f51dd',
      authorId: 'fd592d0f-e414-44dd-bc8d-5b23eb7f51df',
      content: 'Hello world',
      images: [],
      createdAt: date,
      relatedPost: '',
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
    reaction = {
      id: '59ffd7fb-ea8e-47c0-b36a-8461a5526f6d',
      userId: user.id,
      postId: post.id,
      reactionTypeId: reactionType.id,
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

  test('should make a valid reaction ', async () => {
    prismaMock.post.findUnique.mockResolvedValue(post)
    prismaMock.reactionType.findFirst.mockResolvedValue(reactionType)
    prismaMock.reaction.findMany.mockResolvedValue([])
    prismaMock.follow.findFirst.mockResolvedValue(follow)
    prismaMock.profileVisibility.findFirst.mockResolvedValue(null)
    prismaMock.reaction.create.mockResolvedValue(reaction)

    const reactionRepositoryImpl = new ReactionRepositoryImpl(db)
    const reactionService = new ReactionServiceImpl(reactionRepositoryImpl)
    await expect(reactionService.createReaction(user.id, reactionType.type, post.id)).resolves.toEqual({
      id: '59ffd7fb-ea8e-47c0-b36a-8461a5526f6d',
      userId: user.id,
      postId: post.id,
      reactionTypeId: reactionType.id,
      createdAt: date
    })
  })

  test('should not make a reaction if the post does not exist', async () => {
    prismaMock.reactionType.findFirst.mockResolvedValue(reactionType)
    prismaMock.post.findUnique.mockResolvedValue(null)
    const reactionRepositoryImpl = new ReactionRepositoryImpl(db)
    const reactionService = new ReactionServiceImpl(reactionRepositoryImpl)
    await expect(reactionService.createReaction(user.id, reactionType.type, post.id)).rejects.toEqual(new NotFoundException('post'))
  })

  test('should not make a reaction if the reaction type does not exist', async () => {
    prismaMock.reactionType.findFirst.mockResolvedValue(null)
    const reactionRepositoryImpl = new ReactionRepositoryImpl(db)
    const reactionService = new ReactionServiceImpl(reactionRepositoryImpl)
    await expect(reactionService.createReaction(user.id, reactionType.type, post.id)).rejects.toEqual(new NotFoundException('reaction type'))
  })

  test('should not make a reaction if the user does not follow the author of the post', async () => {
    prismaMock.reactionType.findFirst.mockResolvedValue(reactionType)
    prismaMock.post.findUnique.mockResolvedValue(post)
    prismaMock.reaction.findMany.mockResolvedValue([])
    prismaMock.follow.findFirst.mockResolvedValue(null)
    prismaMock.profileVisibility.findFirst.mockResolvedValue(profileVisibility)
    const reactionRepositoryImpl = new ReactionRepositoryImpl(db)
    const reactionService = new ReactionServiceImpl(reactionRepositoryImpl)
    await expect(reactionService.createReaction(user.id, reactionType.type, post.id)).rejects.toEqual(new ForbiddenException())
  })
})
