import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'

export async function listUserCards(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const userCards = await knex('user_cards').where('user_id', request.user.sub)

  return reply.send({
    userCards,
  })
}
