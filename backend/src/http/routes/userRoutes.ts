import { FastifyInstance } from 'fastify'

import { createUser } from '../controllers/user/create-user'
import { authenticateUser } from '../controllers/user/authenticate-user'
import { forgotMyPassword } from '../controllers/user/forgot-my-password'
import { newPassword } from '../controllers/user/new-password'
import { logout } from '../controllers/user/logout'
import { userData } from '../controllers/user/user-data'
import { refreshAccessToken } from '../controllers/user/refresh-access-token'
import { turnUserAdmin } from '../controllers/user/turn-user-admin'
import { verifyJWT } from '../middlewares/verify-jwt'
import { listUserCards } from '../controllers/user-card/list-user-cards'
import { setUserCard } from '../controllers/user-card/set-user-card'
import { removeUserCard } from '../controllers/user-card/remove-user-card'

export function userRoutes(app: FastifyInstance) {
  app.post('/register', createUser)
  app.post('/login', authenticateUser)
  app.post('/forgot-my-password', forgotMyPassword)
  app.post('/new-password', newPassword)
  app.patch('/token/refresh', refreshAccessToken)
  app.post('/turn-user-admin', turnUserAdmin)

  app.post('/logout', { onRequest: [verifyJWT] }, logout)
  app.get('/me', { onRequest: [verifyJWT] }, userData)

  app.get('/user/cards', { onRequest: [verifyJWT] }, listUserCards)
  app.post('/user/cards', { onRequest: [verifyJWT] }, setUserCard)
  app.delete('/user/cards/:id', { onRequest: [verifyJWT] }, removeUserCard)
}
