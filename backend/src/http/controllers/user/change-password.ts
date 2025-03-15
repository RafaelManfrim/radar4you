import { compare, hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { knex } from '@/database'

export async function changePassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const changePasswordBodySchema = z.object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
  })

  const { currentPassword, newPassword } = changePasswordBodySchema.parse(
    request.body,
  )

  const userId = request.user.sub

  const user = await knex('users').where({ id: userId }).first()

  if (!user) {
    return reply.status(400).send({ message: 'Usuário não encontrado' })
  }

  const passwordMatches = await compare(currentPassword, user.password_hash)

  if (!passwordMatches) {
    return reply.status(400).send({ message: 'Senha atual incorreta' })
  }

  const new_password_hash = await hash(newPassword, 6)

  await knex('users')
    .where({ id: user.id })
    .update({ password_hash: new_password_hash })

  return reply.send({ message: 'Senha alterada com sucesso' })
}
