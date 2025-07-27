import jwt from 'jsonwebtoken'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { knex } from '@/database'
import { env } from '@/env'
import { sendResetPasswordEmail } from '@/utils/send-reset-password-email'

export async function forgotPassword(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const forgotPasswordBodySchema = z.object({
    email: z.string().email().nonempty(),
  })

  const { email } = forgotPasswordBodySchema.parse(request.body)

  const user = await knex('users')
    .where({
      email,
      login_provider: 'email',
    })
    .first()

  if (!user) {
    return reply.status(400).send({
      message: 'E-mail não encontrado',
    })
  }

  const token = jwt.sign({ email: user.email }, env.JWT_SECRET, {
    expiresIn: '1h',
  })

  const resetLink = `https://www.${env.DOMAIN}/nova-senha/${token}`

  try {
    await sendResetPasswordEmail({ recipientEmail: user.email, resetLink })
  } catch (error) {
    console.log('Erro ao enviar e-mail de redefinição de senha:', error)
    return reply.status(500).send({
      message: 'Houve um erro ao enviar e-mail de redefinição de senha',
    })
  }

  return reply.send({
    message: 'E-mail de redefinição de senha enviado com sucesso',
  })
}
