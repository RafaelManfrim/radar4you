import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { knex } from '@/database'

export async function deleteSimulation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteSimulationParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteSimulationParamsSchema.parse(request.params)

  const simulation = await knex('simulations')
    .where({
      id,
      user_id: request.user.sub,
    })
    .first()

  if (!simulation) {
    return reply.status(404).send()
  }

  await knex('simulations')
    .where({
      id,
      user_id: request.user.sub,
    })
    .delete()

  return reply.status(204).send()
}
