import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { knex } from '@/database'

export async function createCardBrand(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createCardBrandBodySchema = z.object({
    name: z.string().nonempty(),
    logo_url: z.string().optional(),
  })

  const { name, logo_url } = createCardBrandBodySchema.parse(request.body)

  const createCardBrandReturn = await knex('card_brands')
    .insert({
      id: randomUUID(),
      name,
      logo_url,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*')

  return reply.status(201).send({
    cardBrand: createCardBrandReturn[0],
  })
}
