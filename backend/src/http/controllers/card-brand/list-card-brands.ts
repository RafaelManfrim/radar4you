import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'

export async function listCardBrands(_: FastifyRequest, reply: FastifyReply) {
  const cardBrands = await knex('card_brands').select('*')

  return reply.send({
    cardBrands,
  })
}
