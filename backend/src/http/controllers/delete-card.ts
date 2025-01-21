import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { knex } from '../../database'

export async function deleteCard(request: FastifyRequest, reply: FastifyReply) {
  const deleteCardParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = deleteCardParamsSchema.parse(request.params)

  const card = await knex('cards')
    .where({
      id,
    })
    .first()

  if (!card) {
    return reply.status(404).send()
  }

  await knex('cards').where('id', id).delete()

  return reply.send()
}
