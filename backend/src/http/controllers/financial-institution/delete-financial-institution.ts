import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'
import { z } from 'zod'

export async function deleteFinancialInstitution(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const deleteFinancialInstitutionParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = deleteFinancialInstitutionParamsSchema.parse(request.params)

  const financialInstitution = await knex('financial_institutions')
    .where({ id })
    .first()

  if (!financialInstitution) {
    return reply.status(404).send({
      message: 'Card brand not found',
    })
  }

  await knex('financial_institutions').where({ id }).delete()

  return reply.status(204).send()
}
