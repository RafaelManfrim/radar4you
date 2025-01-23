import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { compare } from 'bcryptjs'

import { knex } from '../../database'

export async function authenticateUser(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateUserBodySchema = z
    .object({
      credentials: z
        .object({
          email: z.string().email().nonempty(),
          password: z.string().min(6),
        })
        .optional(),
      login_provider: z.enum(['email', 'google', 'facebook'], {
        message: 'Invalid login provider',
      }),
      oauth_token: z.string().optional(),
    })
    .refine(
      (data) => data.login_provider !== 'email' || !!data.credentials, // Valida que as credenciais são obrigatórias para login por e-mail
      {
        message: 'Credentials are required when login provider is email',
        path: ['credentials'], // Aponta para o campo relacionado
      },
    )
    .refine(
      (data) => data.login_provider !== 'google' || !!data.oauth_token, // Valida que o oauth_token é obrigatório para login pelo Google
      {
        message: 'OAuth token is required when login provider is google',
        path: ['oauth_token'], // Aponta para o campo relacionado
      },
    )

  const { credentials, login_provider, oauth_token } =
    authenticateUserBodySchema.parse(request.body)

  if (login_provider === 'email') {
    const user = await knex('users')
      .where({
        email: credentials.email,
        login_provider,
      })
      .first()

    if (!user) {
      return reply.status(400).send({
        message: 'Invalid Credentials',
      })
    }

    const passwordMatches = await compare(
      credentials.password ?? '',
      user.password_hash,
    )

    if (!passwordMatches) {
      return reply.status(400).send({
        message: 'Invalid password',
      })
    }

    // TODO: Implement JWT generation and return it to the user

    return reply.send()
  } else if (login_provider === 'google') {
    // TODO: Implement Google OAuth token verification and return a JWT to the user
  } else if (login_provider === 'facebook') {
    // TODO: Implement Facebook OAuth token verification and return a JWT to the user
  }

  return reply.send()
}
