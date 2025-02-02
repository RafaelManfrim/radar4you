import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'
import { z } from 'zod'

export async function deleteCardBrand(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteCardBrandParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = deleteCardBrandParamsSchema.parse(request.params)

  const cardBrand = await knex('card_brands').where({ id }).first()

  if (!cardBrand) {
    return reply.status(404).send({
      message: 'Card brand not found',
    })
  }

  await knex('card_brands').where({ id }).delete()

  return reply.status(204).send()
}
