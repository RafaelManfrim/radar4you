import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'
import { z } from 'zod'

export async function getCard(request: FastifyRequest, reply: FastifyReply) {
  const getCardParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getCardParamsSchema.parse(request.params)

  const card = await knex('cards').where({ id }).first()

  if (!card) {
    return reply.status(404).send({
      message: 'Cartão não encontrado',
    })
  }

  return reply.send({
    card,
  })
}
