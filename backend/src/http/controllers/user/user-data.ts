import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'

export async function userData(request: FastifyRequest, reply: FastifyReply) {
  const user = await knex('users').where('id', request.user.sub).first()

  if (!user) {
    return reply.status(400).send({
      message: 'Usuário não encontrado',
    })
  }

  return reply.send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
