import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { knex } from '../../database'

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({})

  const {} = createUserBodySchema.parse(request.body)

  await knex('users').insert({
    id: randomUUID(),
  })

  return reply.status(201).send()
}
