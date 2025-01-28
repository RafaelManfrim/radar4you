import { FastifyReply } from 'fastify'
import { User } from 'knex/types/tables'

export async function generateTokensJWT(user: User, reply: FastifyReply) {
  const access = await reply.jwtSign(
    {
      role: user.role,
    },
    {
      sign: {
        sub: user.id,
      },
    },
  )

  const refresh = await reply.jwtSign(
    {
      role: user.role,
    },
    {
      sign: {
        sub: user.id,
        expiresIn: '7d',
      },
    },
  )

  return {
    access,
    refresh,
  }
}
