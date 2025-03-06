import jwt from 'jsonwebtoken'
import { hash } from 'bcryptjs'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { knex } from '@/database'
import { env } from '@/env'

export async function resetPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const resetPasswordBodySchema = z.object({
    password: z.string().min(6),
    token: z.string().nonempty(),
  })

  const { password, token } = resetPasswordBodySchema.parse(request.body)

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET)

    if (!decoded || typeof decoded === 'string' || !decoded.email) {
      return reply.status(401).send({ error: 'Token inválido' })
    }

    const email = decoded.email

    const password_hash = await hash(password, 6)

    await knex('users').where({ email }).update({ password_hash })
  } catch (error) {
    return reply.status(401).send({ error: 'Token inválido ou expirado' })
  }

  return reply.send({ message: 'Senha alterada com sucesso!' })
}
