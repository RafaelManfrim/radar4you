import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'
import { z } from 'zod'
import { env } from '@/env'

export async function turnUserAdmin(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const turnUserAdminBodySchema = z.object({
    id: z.string().uuid(),
    database_secure_password: z.string(),
  })

  const { id, database_secure_password } = turnUserAdminBodySchema.parse(
    request.body,
  )

  if (database_secure_password !== env.DATABASE_SECURE_PASSWORD) {
    return reply.status(401).send()
  }

  await knex('users')
    .where({
      id,
    })
    .update({
      role: 'ADMIN',
    })

  return reply.send()
}
