import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { knex } from '@/database'

export async function createCard(request: FastifyRequest, reply: FastifyReply) {
  const createCardBodySchema = z.object({
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
  } = createCardBodySchema.parse(request.body)

  const createCardReturn = await knex('cards')
    .insert({
      id: randomUUID(),
      title,
      card_brand_id: brand_id,
      financial_institution_id,
      points_currency,
      points_conversion_rate,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*')

  return reply.status(201).send({
    card: createCardReturn[0],
  })
}
