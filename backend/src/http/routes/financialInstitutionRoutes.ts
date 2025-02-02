import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../middlewares/verify-jwt'
import { verifyUserRole } from '../middlewares/verify-user-role'
import { createFinancialInstitution } from '../controllers/financial-institution/create-financial-institution'
import { deleteFinancialInstitution } from '../controllers/financial-institution/delete-financial-institution'
import { getFinancialInstitution } from '../controllers/financial-institution/get-financial-institution'
import { listFinancialInstitutions } from '../controllers/financial-institution/list-financial-institutions'
import { updateFinancialInstitution } from '../controllers/financial-institution/update-financial-institution'

export function financialInstitutionRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/financial-institutions', listFinancialInstitutions)
  app.get('/financial-institutions/:id', getFinancialInstitution)
  app.post(
    '/financial-institutions',
    { onRequest: [verifyUserRole('ADMIN')] },
    createFinancialInstitution,
  )
  app.put(
    '/financial-institutions/:id',
    { onRequest: [verifyUserRole('ADMIN')] },
    updateFinancialInstitution,
  )
  app.delete(
    '/financial-institutions/:id',
    { onRequest: [verifyUserRole('ADMIN')] },
    deleteFinancialInstitution,
  )
}
