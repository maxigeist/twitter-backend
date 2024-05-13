import { PrismaClient } from '@prisma/client'

const { NODE_ENV } = process.env

let db: PrismaClient

if (NODE_ENV === 'production') {
  db = new PrismaClient()
} else {
  db = new PrismaClient()
}

export { db }
