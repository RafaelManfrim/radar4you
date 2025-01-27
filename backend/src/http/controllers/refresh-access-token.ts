import { generateTokensJWT } from '@/utils/generate-tokens-jwt'
import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'

export async function refreshAccessToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  await request.jwtVerify({ onlyCookie: true })

  const user = await knex('users').where('id', request.user.sub).first()

  if (!user) {
    return reply.status(401).send({
      message: 'Access token is required for this user to refresh the token',
    })
  }

  const refreshTokenInDb = await knex('user_refresh_tokens')
    .where('user_id', user.id)
    .first()

  if (!refreshTokenInDb) {
    return reply.status(401).send({
      message: 'Refresh token not found',
    })
  }

  const currentDate = new Date()

  if (currentDate > new Date(refreshTokenInDb.expires_at)) {
    return reply.status(401).send({
      message: 'Refresh token expired',
    })
  }

  const { token, refreshToken } = await generateTokensJWT(user, reply)

  return reply
    .setCookie('refreshToken', refreshToken, {
      path: '/',
      secure: true,
      sameSite: true,
      httpOnly: true,
    })
    .send({
      token,
    })
}
