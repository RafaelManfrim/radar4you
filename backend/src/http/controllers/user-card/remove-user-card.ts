import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { knex } from '@/database'

export async function removeUserCard(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const removeUserCardParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = removeUserCardParamsSchema.parse(request.params)

  const userId = request.user.sub

  const userCard = await knex('user_cards')
    .where({
      id,
      user_id: userId,
    })
    .first()

  if (!userCard) {
    return reply.status(404).send()
  }

  await knex('user_cards')
    .where({
      id,
      user_id: userId,
    })
    .delete()

  return reply.status(204).send()
}
