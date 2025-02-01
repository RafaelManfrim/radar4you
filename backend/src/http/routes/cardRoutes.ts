import { FastifyInstance } from 'fastify'

import { createCard } from '../controllers/create-card'
import { updateCard } from '../controllers/update-card'
import { deleteCard } from '../controllers/delete-card'

import { listCardBrands } from '../controllers/list-card-brands'
import { getCardBrand } from '../controllers/getCardBrand'
import { createCardBrand } from '../controllers/create-card-band'
import { updateCardBrand } from '../controllers/updateCardBrand'
import { deleteCardBrand } from '../controllers/delete-card-brand'

import { verifyJWT } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

export function cardRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/cards/brands', listCardBrands)
  app.get('/cards/brands/:id', getCardBrand)
  app.post(
    '/cards/brands',
    { onRequest: [verifyUserRole('ADMIN')] },
    createCardBrand,
  )
  app.put(
    '/cards/brands/:id',
    { onRequest: [verifyUserRole('ADMIN')] },
    updateCardBrand,
  )
  app.delete(
    '/cards/brands/:id',
    { onRequest: [verifyUserRole('ADMIN')] },
    deleteCardBrand,
  )

  app.post('/cards', createCard)
  app.put('/cards/:id', updateCard)
  app.delete('/cards/:id', deleteCard)
}
