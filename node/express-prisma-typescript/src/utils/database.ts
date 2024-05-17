import { PrismaClient } from '@prisma/client'
import * as process from 'node:process'

import PrismaMock from '../test/config'

let db: PrismaClient

if (process.env.NODE_ENV === 'development') {
  db = new PrismaClient()
} else {
  const prismaMock = new PrismaMock()
  db = prismaMock.prismaMock
}

export { db }
