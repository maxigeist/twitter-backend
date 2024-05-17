import { DeepMockProxy } from 'jest-mock-extended'
import db from '../utils/jest.database'
import { PrismaClient } from '@prisma/client'

class PrismaMock {
  prismaMock: DeepMockProxy<PrismaClient>

  constructor () {
    this.prismaMock = db as unknown as DeepMockProxy<PrismaClient>
  }
}

export default PrismaMock
