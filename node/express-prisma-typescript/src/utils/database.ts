import { PrismaClient } from '@prisma/client'
import * as process from 'node:process'
import { getPrismaMock } from '../test/config'

let db: PrismaClient

if (process.env.NODE_ENV === 'development') {
  db = new PrismaClient()
} else {
  db = new PrismaClient()
}

export { db }
