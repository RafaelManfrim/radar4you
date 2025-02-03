import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { knex } from '@/database'

export async function createFinancialInstitution(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createFinancialInstitutionBodySchema = z.object({
    name: z.string().nonempty(),
    logo_url: z.string().optional(),
  })

  const { name, logo_url } = createFinancialInstitutionBodySchema.parse(
    request.body,
  )

  const createFinancialInstitutionReturn = await knex('financial_institutions')
    .insert({
      id: randomUUID(),
      name,
      logo_url,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*')

  return reply.status(201).send({
    financialInstitution: createFinancialInstitutionReturn[0],
  })
}
