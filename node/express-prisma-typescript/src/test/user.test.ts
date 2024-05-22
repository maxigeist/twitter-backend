import { UserServiceImpl } from '../domains/user/service'
import { UserRepositoryImpl } from '../domains/user/repository'
import { beforeAll, describe } from '@jest/globals'
import { prismaMock } from './config'
import { db } from '../utils/database'

let user: { id: string, name: string, email: string, password: string, username: string, profilePicture: string | null, createdAt: Date, updatedAt: Date, deletedAt: Date }
describe('User tests', () => {
  beforeAll(async () => {
    process.env.TOKEN_SECRET = 'nendoanepacene902394iocniampoemce22d2n'
    process.env.TOKEN_LIMIT = '1d'
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
  })

  test('should return a userViewDto by id', async () => {
    prismaMock.user.findUnique.mockResolvedValue(user)

    const userRepositoryImpl = new UserRepositoryImpl(db)
    await expect(userRepositoryImpl.getById('59ffd7fb-ea8e-47c0-b36a-8461a5526f6d')).resolves.toEqual({
      id: '59ffd7fb-ea8e-47c0-b36a-8461a5526f6d',
      name: 'Rich',
      username: 'Rich123',
      profilePicture: null
    })
  })

  test('should return that the user does not have a private account', async () => {
    prismaMock.profileVisibility.findFirst.mockResolvedValue(null)
    const userRepository = new UserRepositoryImpl(db)
    const userServiceImpl = new UserServiceImpl(userRepository)
    await expect(userServiceImpl.userHasPrivateAccount('57851566-f38d-48ee-9786-4723ee5db9c0')).resolves.toEqual(false)
  })
})
