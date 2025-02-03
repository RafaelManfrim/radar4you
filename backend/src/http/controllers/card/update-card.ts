import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { knex } from '@/database'

export async function updateCard(request: FastifyRequest, reply: FastifyReply) {
  const updateCardParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = updateCardParamsSchema.parse(request.params)

  const updateCardBodySchema = z.object({
    title: z.string().nonempty(),
    financial_institution_id: z.string().uuid().nonempty(),
    brand_id: z.string().uuid().nonempty(),
    points_conversion_rate: z.number().positive(),
    points_currency: z.enum(['USD', 'BRL']),
  })

  const {
    title,
    financial_institution_id,
    brand_id,
    points_conversion_rate,
    points_currency,
  } = updateCardBodySchema.parse(request.body)

  const card = await knex('cards')
    .where({
      id,
    })
    .first()

  if (!card) {
    return reply.status(404).send()
  }

  const updateCardReturn = await knex('cards')
    .where('id', id)
    .update({
      title,
      financial_institution_id,
      card_brand_id: brand_id,
      points_currency,
      points_conversion_rate,
      updated_at: new Date(),
    })
    .returning('*')

  return reply.send({
    card: updateCardReturn[0],
  })
}
