import { FastifyInstance } from 'fastify'

import { createUser } from '../controllers/create-user'
import { authenticateUser } from '../controllers/authenticate-user'
import { forgotMyPassword } from '../controllers/forgot-my-password'
import { newPassword } from '../controllers/new-password'
import { logout } from '../controllers/logout'
import { userData } from '../controllers/user-data'
import { refreshAccessToken } from '../controllers/refresh-access-token'
import { verifyJWT } from '../middlewares/verify-jwt'

export function userRoutes(app: FastifyInstance) {
  app.post('/register', createUser)
  app.post('/login', authenticateUser)
  app.post('/forgot-my-password', forgotMyPassword)
  app.post('/new-password', newPassword)
  app.patch('/token/refresh', refreshAccessToken)

  app.post('/logout', { onRequest: [verifyJWT] }, logout)
  app.get('/me', { onRequest: [verifyJWT] }, userData)
}
