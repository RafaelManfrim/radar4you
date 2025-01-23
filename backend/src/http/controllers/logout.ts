import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '../../database'

export async function logout(request: FastifyRequest, reply: FastifyReply) {
  return reply.send()
}
