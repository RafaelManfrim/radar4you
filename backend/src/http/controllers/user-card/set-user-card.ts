import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { knex } from '@/database'

export async function setUserCard(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const setUserCardBodySchema = z.object({
    card_id: z.string().uuid().nonempty(),
  })

  const { card_id } = setUserCardBodySchema.parse(request.body)

  const userId = request.user.sub

  const userCards = await knex('user_cards')
    .where('user_id', userId)
    .returning('*')

  if (userCards.length >= 3) {
    return reply.status(400).send({
      message: 'Você já atingiu o limite de 3 cartões',
    })
  }

  const setUserCardReturn = await knex('user_cards')
    .insert({
      id: randomUUID(),
      card_id,
      user_id: userId,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*')

  return reply.status(201).send({
    userCard: {
      ...setUserCardReturn[0],
    },
  })
}
