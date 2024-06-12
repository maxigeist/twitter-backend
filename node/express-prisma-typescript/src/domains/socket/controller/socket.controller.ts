import { db, socketAuth } from '@utils'
import 'express-async-errors'
import { SocketRepositoryImpl } from '@domains/socket/repository'
import { SocketService, SocketServiceImpl } from '@domains/socket/service'

import { Server } from 'socket.io'

const service: SocketService = new SocketServiceImpl(new SocketRepositoryImpl(db))

export class SocketController {
  constructor (private readonly io: Server) {
    const userSocketMap: any = {}
    this.io.on('connection', async (socket) => {
      try {
        socketAuth(socket)
        const { userId } = socket.handshake.auth.userId
        userSocketMap[userId] = socket.id
        const conversations = await service.getConversations(userId)
        socket.emit('new-connection', conversations)
      } catch (error) {
        socket.disconnect()
      }
      socket.on('send message', async (msg) => {
        const { userId } = socket.handshake.auth.userId
        const { content, conversationId } = msg
        try {
          const message = await service.createMessage(userId, { content, conversationId })
          this.io.to(conversationId).emit('receive message', message)
          const usersInConversation = await service.getConversationMembersIds(conversationId)
          for (const user of usersInConversation) {
            const userSocketId = userSocketMap[user]
            if (userSocketId) {
              const updatedConversations = await service.getConversations(user)
              this.io.to(userSocketId).emit('new-connection', updatedConversations)
            }
          }
        } catch (error) {
          socket.disconnect()
        }
      })

      socket.on('join room', async (msg) => {
        const { conversationId } = msg
        await socket.join(conversationId)
      })

      socket.on('leave room', async (msg) => {
        const { conversationId } = msg
        await socket.leave(conversationId)
      })

      socket.on('disconnect', () => {})
    })
  }
}
