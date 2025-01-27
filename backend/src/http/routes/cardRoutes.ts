import { FastifyInstance } from 'fastify'

import { createCard } from '../controllers/create-card'
import { updateCard } from '../controllers/update-card'
import { deleteCard } from '../controllers/delete-card'
import { verifyJWT } from '../middlewares/verify-jwt'

export function cardRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/cards', createCard)
  app.put('/cards/:id', updateCard)
  app.delete('/cards/:id', deleteCard)

  // app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create) // Example of how to use a middleware to check the user role
}
