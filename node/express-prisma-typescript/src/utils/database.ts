import { PrismaClient } from '@prisma/client'
import { prismaMock } from '../test/config'

const { NODE_ENV } = process.env

let db: PrismaClient

if (NODE_ENV === 'production') {
  db = new PrismaClient()
} else {
  db = prismaMock
}

export { db }
