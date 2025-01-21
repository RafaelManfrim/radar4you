import { FastifyInstance } from 'fastify'
import { createCard } from './controllers/create-card'
import { updateCard } from './controllers/update-card'
import { deleteCard } from './controllers/delete-card'
import { createUser } from './controllers/create-user'
import { authenticateUser } from './controllers/authenticate-user'
import { forgotMyPassword } from './controllers/forgot-my-password'
import { newPassword } from './controllers/new-password'

export function appRoutes(app: FastifyInstance) {
  app.post('/register', createUser)
  app.post('/login', authenticateUser)
  app.post('/forgot-my-password', forgotMyPassword)
  app.post('/new-password', newPassword)

  app.post('/cards', createCard)
  app.put('/cards/:id', updateCard)
  app.delete('/cards/:id', deleteCard)
}
