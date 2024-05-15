import { db, socketAuth } from '@utils'
import 'express-async-errors'
import { SocketRepositoryImpl } from '@domains/socket/repository'
import { SocketService, SocketServiceImpl } from '@domains/socket/service'

import { Server } from 'socket.io'

const service: SocketService = new SocketServiceImpl(new SocketRepositoryImpl(db))

export class SocketController {
  constructor (private readonly io: Server) {
    this.io.on('connection', (socket) => {
      try {
        socketAuth(socket)
      } catch (error) {
        socket.disconnect()
      }
      socket.on('send message', async (msg) => {
        const { content, conversationId } = msg
        const { userId } = socket.handshake.auth.userId
        const messageAux = await service.createMessage(userId, { content, conversationId })
        socket.broadcast.to(conversationId).emit('receive message', messageAux.content)
      })

      socket.on('join room', async (msg) => {
        const { conversationId } = msg
        await socket.join(conversationId)
      })

      socket.on('leave room', async (msg) => {
        const { conversationId } = msg
        await socket.leave(conversationId)
      })

      socket.on('disconnect', () => {
        console.log('user disconnected')
      })
    })
  }
}
