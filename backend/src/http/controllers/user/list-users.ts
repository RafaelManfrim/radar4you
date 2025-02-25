import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'

export async function listUsers(
  _: FastifyRequest,
  reply: FastifyReply,
) {
  const users = await knex('users').select('*')

  return reply.send({
    users,
  })
}
