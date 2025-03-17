import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { knex } from '@/database'

export async function createCard(request: FastifyRequest, reply: FastifyReply) {
  const createCardBodySchema = z.object({
    title: z.string().nonempty(),
    financial_institution_id: z.string().uuid().nonempty(),
    brand_id: z.string().uuid().nonempty(),
    points_conversion_rate: z.number().positive(),
    points_currency: z.enum(['USD', 'BRL']),
    is_recommended: z.boolean().optional(),
    annual_fee: z.number().nonnegative().optional(),
    benefits: z.string().optional(),
    vip_lounges: z.string().optional(),
  })

  const {
    title,
    financial_institution_id,
    brand_id,
    points_conversion_rate,
    points_currency,
    is_recommended,
    annual_fee,
    benefits,
    vip_lounges,
  } = createCardBodySchema.parse(request.body)

  const createCardReturn = await knex('cards')
    .insert({
      id: randomUUID(),
      title,
      card_brand_id: brand_id,
      financial_institution_id,
      points_currency,
      points_conversion_rate,
      is_recommended,
      annual_fee,
      benefits,
      vip_lounges,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*')

  const financialInstitution = await knex('financial_institutions')
    .where('id', financial_institution_id)
    .first()

  const cardBrand = await knex('card_brands').where('id', brand_id).first()

  return reply.status(201).send({
    card: {
      ...createCardReturn[0],
      financial_institution_name: financialInstitution?.name,
      financial_institution_logo_url: financialInstitution?.logo_url,
      card_brand_name: cardBrand?.name,
      card_brand_logo_url: cardBrand?.logo_url,
    },
  })
}
