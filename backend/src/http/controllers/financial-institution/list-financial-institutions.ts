import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'

export async function listFinancialInstitutions(
  _: FastifyRequest,
  reply: FastifyReply,
) {
  const financialInstitutions = await knex('financial_institutions').select('*')

  return reply.send({
    financialInstitutions,
  })
}
