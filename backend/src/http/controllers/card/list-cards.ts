import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'

export async function listCards(_: FastifyRequest, reply: FastifyReply) {
  const cards = await knex('cards').select('*')

  return reply.send({
    cards,
  })
}
