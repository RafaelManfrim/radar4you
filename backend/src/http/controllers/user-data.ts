import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '../../database'

export async function userData(request: FastifyRequest, reply: FastifyReply) {
  return reply.send()
}
