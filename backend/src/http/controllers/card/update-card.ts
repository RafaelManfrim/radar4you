import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { knex } from '@/database'

export async function updateCard(request: FastifyRequest, reply: FastifyReply) {
  const updateCardParamsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = updateCardParamsSchema.parse(request.params)

  const updateCardBodySchema = z.object({
    title: z.string().nonempty(),
    financial_institution_id: z.string().uuid().nonempty(),
    brand_id: z.string().uuid().nonempty(),
    points_conversion_rate: z.number().positive(),
    points_currency: z.enum(['USD', 'BRL']),
    is_recommended: z.boolean().optional(),
    annual_fee: z.number().nonnegative().optional(),
    benefits: z.string().optional(),
    vip_lounges: z.string().optional(),
    image_url: z.string().optional(),
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
    image_url,
  } = updateCardBodySchema.parse(request.body)

  const card = await knex('cards')
    .where({
      id,
    })
    .first()

  if (!card) {
    return reply.status(404).send({
      message: 'Cartão não encontrado',
    })
  }

  const updateCardReturn = await knex('cards')
    .where('id', id)
    .update({
      title,
      image_url,
      financial_institution_id,
      card_brand_id: brand_id,
      points_currency,
      points_conversion_rate,
      is_recommended,
      annual_fee,
      benefits,
      vip_lounges,
      updated_at: new Date(),
    })
    .returning('*')

  const financialInstitution = await knex('financial_institutions')
    .where('id', financial_institution_id)
    .first()

  const cardBrand = await knex('card_brands').where('id', brand_id).first()

  return reply.send({
    card: {
      ...updateCardReturn[0],
      financial_institution_name: financialInstitution?.name,
      financial_institution_logo_url: financialInstitution?.logo_url,
      card_brand_name: cardBrand?.name,
      card_brand_logo_url: cardBrand?.logo_url,
    },
  })
}
