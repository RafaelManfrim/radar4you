import { FastifyInstance } from 'fastify'

import { createCard } from '../controllers/card/create-card'
import { updateCard } from '../controllers/card/update-card'
import { deleteCard } from '../controllers/card/delete-card'

import { verifyJWT } from '../middlewares/verify-jwt'

export function cardRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/cards', createCard)
  app.put('/cards/:id', updateCard)
  app.delete('/cards/:id', deleteCard)
}
