import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { knex } from '@/database'

export async function updateCard(request: FastifyRequest, reply: FastifyReply) {
  const updateCardParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = updateCardParamsSchema.parse(request.params)

  const updateCardBodySchema = z.object({})

  const {} = updateCardBodySchema.parse(request.body)

  const card = await knex('cards')
    .where({
      id,
    })
    .first()

  if (!card) {
    return reply.status(404).send()
  }

  await knex('cards').where('id', id).update({})

  return reply.send()
}
