import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { Constants, NodeEnv, Logger } from '@utils'
import { router } from '@router'
import { ErrorHandling } from '@utils/errors'
import { SocketController } from '@domains/socket/controller/socket.controller'
import { Server } from 'socket.io'
import swaggerUi from 'swagger-ui-express'
import swaggerOutput from './swagger/swagger_output.json'

const app = express()

// Set up request logger
if (Constants.NODE_ENV === NodeEnv.DEV) {
  app.use(morgan('tiny')) // Log requests only in development environments
}

// Set up request parsers
app.use(express.json()) // Parses application/json payloads request bodies
app.use(express.urlencoded({ extended: false })) // Parse application/x-www-form-urlencoded request bodies
app.use(cookieParser()) // Parse cookies

// Set up CORS
app.use(
  cors({
    origin: Constants.CORS_WHITELIST
  })
)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput))

app.use('/api', router)

app.use(ErrorHandling)

app.listen(Constants.PORT, () => {
  Logger.info(`Server listening on port ${Constants.PORT}`)
})

const socketServer = app.listen(3001, () => {
  console.log('Socket server running at http://localhost:3001')
})

// const io = new Server(socketServer)

const socketController = new SocketController(
  new Server(socketServer, {
    cors: {
      origin: 'http://localhost:3000'
    }
  })
)
