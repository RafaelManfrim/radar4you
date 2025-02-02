import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { knex } from '@/database'

export async function forgotMyPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  return reply.send()
}
