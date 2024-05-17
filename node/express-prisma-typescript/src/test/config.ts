import { PrismaClient } from '@prisma/client'
import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import db from '../utils/jest.database'

export const getPrismaMock = (): DeepMockProxy<PrismaClient> => {
  const prismaMock = db as unknown as DeepMockProxy<PrismaClient>
  jest.mock('../utils/jest.database', () => ({
    __esModule: true,
    default: mockDeep<PrismaClient>()
  }))

  return prismaMock
}
