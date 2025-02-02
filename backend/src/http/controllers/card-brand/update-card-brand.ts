import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'
import { z } from 'zod'

export async function updateCardBrand(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateCardBrandParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = updateCardBrandParamsSchema.parse(request.params)

  const updateCardBrandBodySchema = z.object({
    name: z.string().nonempty(),
    logo_url: z.string().optional(),
  })

  const { name, logo_url } = updateCardBrandBodySchema.parse(request.body)

  const cardBrand = await knex('card_brands').where({ id }).first()

  if (!cardBrand) {
    return reply.status(404).send({
      message: 'Card brand not found',
    })
  }

  const updateCardBrandReturn = await knex('card_brands')
    .where({ id })
    .update({
      name,
      logo_url,
    })
    .returning('*')

  return reply.send({
    cardBrand: updateCardBrandReturn[0],
  })
}
