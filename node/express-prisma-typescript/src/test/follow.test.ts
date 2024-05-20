
import { FollowRepositoryImpl } from '../domains/follow/repository'
import { FollowServiceImpl } from '../domains/follow/service'
import { NotFoundException, ValidationException } from '../utils'
import { db } from '../utils/database'
import { prismaMock } from './config'
import { mockReset } from 'jest-mock-extended'

let user: { id: string, name: string, email: string, password: string, username: string, profilePicture: string | null, createdAt: Date, updatedAt: Date, deletedAt: Date }
let user2: { id: string, name: string, email: string, password: string, username: string, profilePicture: string | null, createdAt: Date, updatedAt: Date, deletedAt: Date }
let follow: { id: string, followerId: string, followedId: string, createdAt: Date, updatedAt: Date, deletedAt: Date }
let extendedFollow: { id: string, followerId: string, followedId: string, createdAt: Date }
describe('Follow tests', () => {
  beforeAll(async () => {
    const date = new Date()
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
    follow = {
      id: '59ffd7fb-ea8e-47c0-b36a-8461a5526f6d',
      followerId: user.id,
      followedId: user2.id,
      createdAt: date,
      updatedAt: date,
      deletedAt: date
    }
    extendedFollow = {
      id: '59ffd7fb-ea8e-47c0-b36a-8461a5526f6d',
      followerId: user.id,
      followedId: user2.id,
      createdAt: date
    }
  })
  beforeEach(() => {
    mockReset(prismaMock)
  })

  test('should follow a user', async () => {
    prismaMock.follow.findFirst.mockResolvedValue(null)
    prismaMock.follow.create.mockResolvedValue(follow)

    const followRepositoryImpl = new FollowRepositoryImpl(db)
    const followService = new FollowServiceImpl(followRepositoryImpl)
    await expect(followService.createFollow(user.id, user2.id)).resolves.toEqual(extendedFollow)
  })

  test('should not follow a user if the other userId does not exist', async () => {
    const followRepositoryImpl = new FollowRepositoryImpl(db)
    const followService = new FollowServiceImpl(followRepositoryImpl)
    await expect(followService.createFollow(user.id, '')).rejects.toEqual(new NotFoundException('user'))
  })

  test('should not follow a user if the userid are the same', async () => {
    // prismaMock.follow.findFirst.mockResolvedValue(null)
    const followRepositoryImpl = new FollowRepositoryImpl(db)
    const followService = new FollowServiceImpl(followRepositoryImpl)
    await expect(followService.createFollow(user.id, user.id)).rejects.toEqual(new ValidationException([{ message: "A user can't follow himself" }]))
  })
})
