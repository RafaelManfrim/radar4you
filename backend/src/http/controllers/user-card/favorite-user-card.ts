import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { knex } from '@/database'

export async function toggleFavoriteUserCard(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const toggleFavoriteUserCardParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = toggleFavoriteUserCardParamsSchema.parse(request.params)

  const userId = request.user.sub

  const userCards = await knex('user_cards').where({
    user_id: userId,
  })

  const userFavoriteCard = userCards.find((userCard) => userCard.is_favorite)

  if (userFavoriteCard && userFavoriteCard.id !== id) {
    return reply.status(400).send({
      message: 'Você já possui um cartão favorito',
    })
  }

  await knex('user_cards')
    .where({
      id,
      user_id: userId,
    })
    .update({
      is_favorite: knex.raw('NOT is_favorite'),
    })

  return reply.status(200).send()
}
