import { FastifyInstance } from 'fastify'

import { verifyJWT } from '../middlewares/verify-jwt'
import { listSimulations } from '../controllers/simulation/list-simulations'
import { createSimulation } from '../controllers/simulation/create-simulation'

export function simulationRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.get('/simulations', listSimulations)
  app.post('/simulations', createSimulation)
}
