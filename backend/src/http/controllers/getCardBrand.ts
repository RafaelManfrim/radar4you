import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '../../database'
import { z } from 'zod'

export async function getCardBrand(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getCardBrandParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getCardBrandParamsSchema.parse(request.params)

  const cardBrand = await knex('card_brands').where({ id }).first()

  if (!cardBrand) {
    return reply.status(404).send({
      message: 'Card brand not found',
    })
  }

  return reply.send({
    cardBrand,
  })
}
