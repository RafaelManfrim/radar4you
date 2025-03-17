import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'

export async function listSimulations(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const simulations = await knex('simulations')
    .where({
      user_id: request.user.sub,
    })
    .orderBy('created_at', 'desc')
    .returning('*')

  return reply.send({
    simulations: await Promise.all(
      simulations.map(async (simulation) => {
        const simulationCards = await knex('simulation_cards').where(
          'simulation_id',
          simulation.id,
        )

        return {
          ...simulation,
          simulationCards: await Promise.all(
            simulationCards.map(async (simulationCard) => {
              const card = await knex('cards')
                .where('id', simulationCard.card_id)
                .first()

              const financialInstitution = await knex('financial_institutions')
                .where('id', card?.financial_institution_id)
                .first()

              return {
                ...simulationCard,
                card,
                financialInstitution,
              }
            }),
          ),
        }
      }),
    ),
  })
}
