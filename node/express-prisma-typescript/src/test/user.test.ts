import { UserRepositoryImpl } from '../domains/user/repository'
import db from '../utils/jest.database'
import { prismaMock } from '../test/config'

let user: { id: string, name: string, email: string, password: string, username: string, profilePicture: string | null, createdAt: Date, updatedAt: Date, deletedAt: Date }
let profileVisibility: { id: string, userId: string, profileTypeId: string, type: { id: string, type: string } }
let profileType: { id: string, type: string }
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
  // profileVisibility = { userId: '59ffd7fb-ea8e-47c0-b36a-8461a5526f6d', profileTypeId: '1', type: { id: '1', type: 'public ' } }
  profileType = { id: '1', type: 'public' }
  await db.user.deleteMany()
  // await db.profileVisibility.create({ data: profileVisibility })
})

test('should return a user by id', async () => {
  prismaMock.user.create.mockResolvedValue(user)
  prismaMock.user.findUnique.mockResolvedValue(user)

  const userRepositoryImpl = new UserRepositoryImpl(db)
  await expect(userRepositoryImpl.getById('1')).resolves.toEqual({
    id: '1',
    name: 'Rich',
    username: 'Rich123',
    profilePicture: null
  })
})

test('should return that the user has a private account', async () => {
  const userRepositoryImpl = new UserRepositoryImpl(db)
  await userRepositoryImpl.create(user)

  await expect(userRepositoryImpl.userHasPrivateAccount('59ffd7fb-ea8e-47c0-b36a-8461a5526f6d')).resolves.toEqual(false)
})
