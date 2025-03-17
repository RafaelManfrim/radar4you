import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'
import { z } from 'zod'

export async function updateFinancialInstitution(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateFinancialInstitutionParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = updateFinancialInstitutionParamsSchema.parse(request.params)

  const updateFinancialInstitutionBodySchema = z.object({
    name: z.string().nonempty(),
    markup: z.number().nonnegative().optional(),
    logo_url: z.string().optional(),
  })

  const { name, markup, logo_url } = updateFinancialInstitutionBodySchema.parse(
    request.body,
  )

  const financialInstitution = await knex('financial_institutions')
    .where({ id })
    .first()

  if (!financialInstitution) {
    return reply.status(404).send({
      message: 'Instituição financeira não encontrada',
    })
  }

  const updateFinancialInstitutionReturn = await knex('financial_institutions')
    .where({ id })
    .update({
      name,
      markup,
      logo_url,
      updated_at: new Date(),
    })
    .returning('*')

  return reply.send({
    financialInstitution: updateFinancialInstitutionReturn[0],
  })
}
