import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'

import { createCardBrand } from '../controllers/card-brand/create-card-band'
import { deleteCardBrand } from '../controllers/card-brand/delete-card-brand'
import { getCardBrand } from '../controllers/card-brand/get-card-brand'
import { listCardBrands } from '../controllers/card-brand/list-card-brands'
import { updateCardBrand } from '../controllers/card-brand/update-card-brand'

export function cardBrandRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/card-brands', listCardBrands)
  app.get('/card-brands/:id', getCardBrand)
  app.post(
    '/card-brands',
    { onRequest: [verifyUserRole('ADMIN')] },
    createCardBrand,
  )
  app.put(
    '/card-brands/:id',
    { onRequest: [verifyUserRole('ADMIN')] },
    updateCardBrand,
  )
  app.delete(
    '/card-brands/:id',
    { onRequest: [verifyUserRole('ADMIN')] },
    deleteCardBrand,
  )
}
