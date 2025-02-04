import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'

export async function listCards(_: FastifyRequest, reply: FastifyReply) {
  const cards = await knex('cards')
    .join(
      'financial_institutions',
      'cards.financial_institution_id',
      'financial_institutions.id',
    )
    .join('card_brands', 'cards.card_brand_id', 'card_brands.id')
    .select(
      'cards.*',
      {
        financial_institution_name: 'financial_institutions.name',
        financial_institution_logo_url: 'financial_institutions.logo_url',
      },
      {
        card_brand_name: 'card_brands.name',
        card_brand_logo_url: 'card_brands.logo_url',
      },
    )

  return reply.send({
    cards,
  })
}
