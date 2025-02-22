import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { knex } from '@/database'
import { env } from '@/env'

export async function createSimulation(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createSimulationBodySchema = z.object({
    cards_ids: z.array(
      z.string().refine((value) => {
        if (!value) {
          throw new Error('Card ID is required')
        }

        return true
      }),
    ),
    simulation_type: z.enum(['purchase', 'monthly_spending', 'period']),
    amount: z.number().optional(),
    desired_points: z.number().optional(),
    monthly_spending: z.number().optional(),
    months: z.number().optional(),
  })

  const {
    cards_ids,
    simulation_type,
    amount,
    desired_points,
    monthly_spending,
    months,
  } = createSimulationBodySchema.parse(request.body)

  const createSimulationReturn = await knex('simulations')
    .insert({
      id: randomUUID(),
      user_id: request.user.sub,
      amount,
      desired_points,
      monthly_spending,
      months,
      simulation_type,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*')

  const cards = await knex('cards').whereIn('id', cards_ids)

  const fiveMinutesAgo =
    env.DATABASE_CLIENT === 'sqlite'
      ? knex.raw("datetime('now', '-5 minutes')")
      : knex.raw("NOW() - INTERVAL '5 minutes'")

  let dollar_quotes = await knex('dollar_quotes')
    .where('retrieved_at', '>=', fiveMinutesAgo)
    .orderBy('retrieved_at', 'desc')
    .first()

  // Se não tiver a cotação do dolar, busca a última cotação disponível na API externa e salvar no banco de dados
  if (!dollar_quotes) {
    dollar_quotes = (
      await fetch('https://economia.awesomeapi.com.br/last/USD-BRL')
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch dollar quotes')
          }

          return response.json()
        })
        .then((data) => {
          const exchange_rate = data.USDBRL.bid
          return knex('dollar_quotes')
            .insert({
              id: randomUUID(),
              exchange_rate,
              retrieved_at: new Date(),
            })
            .returning('*')
        })
    )[0]
  }

  const simulationsCardsReturn = await knex('simulation_cards')
    .insert(
      cards_ids.map((card_id) => {
        const card = cards.find((card) => card.id === card_id)

        if (!card) {
          throw new Error('Card not found')
        }

        // Valor gasto está em reais
        // Se o cartão converte em dolar, primeiro precisamos converter a compra para dolar
        let amountInDollar
        let earned_points
        let required_spending
        let required_months

        if (simulation_type === 'purchase' && amount) {
          if (card.points_currency === 'BRL') {
            amountInDollar = (amount * 100) / dollar_quotes?.exchange_rate

            // Pontos ganhos com a compra
            earned_points = Math.floor(
              amountInDollar * card.points_conversion_rate,
            )
          }
        }

        if (
          simulation_type === 'monthly_spending' &&
          desired_points &&
          months
        ) {
          // Valor necessário para gastar mensalmente
          required_spending =
            ((desired_points / card.points_conversion_rate) * 100) / months
        }

        if (
          simulation_type === 'period' &&
          desired_points &&
          monthly_spending
        ) {
          // Tempo necessário para atingir os pontos desejados
          required_months = Math.ceil(
            desired_points / card.points_conversion_rate / monthly_spending,
          )
        }

        return {
          id: randomUUID(),
          simulation_id: createSimulationReturn[0].id,
          card_id,
          earned_points,
          required_months,
          required_spending,
        }
      }),
    )
    .returning('*')

  return reply.status(201).send({
    simulation: {
      ...createSimulationReturn[0],
      simulationCards: [...simulationsCardsReturn],
    },
  })
}
