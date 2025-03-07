import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'
import { z } from 'zod'

export async function getFinancialInstitution(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const getFinancialInstitutionParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = getFinancialInstitutionParamsSchema.parse(request.params)

  const financialInstitution = await knex('financial_institutions')
    .where({ id })
    .first()

  if (!financialInstitution) {
    return reply.status(404).send({
      message: 'Instituição financeira não encontrada',
    })
  }

  return reply.send({
    financialInstitution,
  })
}
