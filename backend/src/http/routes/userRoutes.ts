import { FastifyInstance } from 'fastify'

import { createUser } from '../controllers/user/create-user'
import { authenticateUser } from '../controllers/user/authenticate-user'
import { forgotPassword } from '../controllers/user/forgot-password'
import { resetPassword } from '../controllers/user/reset-password'
import { logout } from '../controllers/user/logout'
import { userData } from '../controllers/user/user-data'
import { refreshAccessToken } from '../controllers/user/refresh-access-token'
import { turnUserAdmin } from '../controllers/user/turn-user-admin'
import { verifyJWT } from '../middlewares/verify-jwt'
import { listUserCards } from '../controllers/user-card/list-user-cards'
import { setUserCard } from '../controllers/user-card/set-user-card'
import { removeUserCard } from '../controllers/user-card/remove-user-card'
import { listUsers } from '../controllers/user/list-users'
import { verifyUserRole } from '../middlewares/verify-user-role'

export function userRoutes(app: FastifyInstance) {
  app.post('/register', createUser)
  app.post('/login', authenticateUser)
  app.post('/forgot-password', forgotPassword)
  app.post('/reset-password', resetPassword)
  app.patch('/token/refresh', refreshAccessToken)
  app.post(
    '/turn-user-admin',
    { onRequest: [verifyJWT, verifyUserRole('ADMIN')] },
    turnUserAdmin,
  )

  app.post('/logout', { onRequest: [verifyJWT] }, logout)
  app.get('/me', { onRequest: [verifyJWT] }, userData)

  app.get(
    '/users',
    { onRequest: [verifyJWT, verifyUserRole('ADMIN')] },
    listUsers,
  )
  app.get('/users/cards', { onRequest: [verifyJWT] }, listUserCards)
  app.post('/users/cards', { onRequest: [verifyJWT] }, setUserCard)
  app.delete('/users/cards/:id', { onRequest: [verifyJWT] }, removeUserCard)
}
