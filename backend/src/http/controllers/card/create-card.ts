import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { knex } from '@/database'

export async function createCard(request: FastifyRequest, reply: FastifyReply) {
  const createCardBodySchema = z.object({})

  const {} = createCardBodySchema.parse(request.body)

  await knex('cards').insert({
    id: randomUUID(),
  })

  return reply.status(201).send()
}
