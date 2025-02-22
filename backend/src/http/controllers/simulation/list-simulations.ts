import { FastifyReply, FastifyRequest } from 'fastify'

import { knex } from '@/database'

export async function listSimulations(_: FastifyRequest, reply: FastifyReply) {
  const simulations = await knex('simulations').returning('*')

  return reply.send({
    simulations: simulations.map(async (simulation) => {
      const simulationCards = await knex('simulation_cards').where(
        'simulation_id',
        simulation.id,
      )

      return {
        ...simulation,
        simulationCards,
      }
    }),
  })
}
