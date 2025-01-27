import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  await knex('user_refresh_tokens')
    .where({
      user_id: request.user.sub,
    })
    .delete()

  return reply.status(204).send()
}
