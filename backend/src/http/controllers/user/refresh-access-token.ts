import { generateTokensJWT } from '@/utils/generate-tokens-jwt'
import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'
import { z } from 'zod'
import { decodeJWT } from '@/utils/decode-jwt'

export async function refreshAccessToken(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const refreshAccessTokenBodySchema = z.object({
    refresh: z.string(),
  })

  const { refresh: oldRefresh } = refreshAccessTokenBodySchema.parse(
    request.body,
  )

  const data = await decodeJWT(oldRefresh)

  const user = await knex('users').where('id', data.sub).first()

  if (!user) {
    return reply.status(400).send({
      message: 'User not found',
    })
  }

  const refreshTokenInDb = await knex('user_refresh_tokens')
    .where('user_id', user.id)
    .first()

  if (!refreshTokenInDb) {
    return reply.status(400).send({
      message: 'Refresh token not found',
    })
  }

  const currentDate = new Date()

  if (currentDate > new Date(refreshTokenInDb.expires_at)) {
    return reply.status(401).send({
      message: 'Refresh token expired',
    })
  }

  const { access, refresh } = await generateTokensJWT(user, reply)

  return reply.send({ access, refresh })
}
