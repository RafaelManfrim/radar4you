import { FastifyReply, FastifyRequest } from 'fastify'
import { randomUUID } from 'node:crypto'
import { z } from 'zod'

import { knex } from '@/database'
import { DollarQuotes } from 'knex/types/tables'

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
    product: z.string().optional(),
    desired_points: z.number().optional(),
    monthly_spending: z.number().optional(),
    months: z.number().optional(),
  })

  const {
    cards_ids,
    simulation_type,
    amount,
    product,
    desired_points,
    monthly_spending,
    months,
  } = createSimulationBodySchema.parse(request.body)

  const cards = await knex('cards').whereIn('id', cards_ids)

  let dollar_quotes: DollarQuotes | undefined

  if (cards.some((card) => card.points_currency === 'USD')) {
    dollar_quotes = await knex('dollar_quotes')
      .orderBy('retrieved_at', 'desc')
      .first()

    const dollarQuotesIsOutdated =
      dollar_quotes &&
      new Date().getTime() - new Date(dollar_quotes.retrieved_at).getTime() >
        300000 // 5 minutes

    // Se não tiver a cotação do dolar, busca a última cotação disponível na API externa e salvar no banco de dados
    if (!dollar_quotes || dollarQuotesIsOutdated) {
      try {
        const response = await fetch(
          'https://economia.awesomeapi.com.br/last/USD-BRL',
        )

        if (!response.ok) {
          throw new Error('Failed to fetch dollar quotes')
        }

        const data = await response.json()

        const exchange_rate = data.USDBRL.bid

        dollar_quotes = (
          await knex('dollar_quotes')
            .insert({
              id: randomUUID(),
              exchange_rate,
              retrieved_at: new Date(),
            })
            .returning('*')
        )[0]
      } catch (error) {
        console.log(error)

        if (!dollar_quotes) {
          return reply.status(500).send({
            message: 'Cotação do dólar indisponível',
          })
        }

        // Usar cotação do dolar mais antiga
      }
    }
  }

  const createSimulationReturn = await knex('simulations')
    .insert({
      id: randomUUID(),
      user_id: request.user.sub,
      amount,
      desired_points,
      monthly_spending,
      exchange_rate: dollar_quotes?.exchange_rate,
      months,
      product,
      simulation_type,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning('*')

  const financialInstitutions = await knex('financial_institutions')

  const simulationsCardsReturn = await knex('simulation_cards')
    .insert(
      cards_ids.map((card_id) => {
        const card = cards.find((card) => card.id === card_id)

        if (!card) {
          throw new Error('Card not found')
        }

        if (card.points_currency === 'USD' && !dollar_quotes) {
          throw new Error('Cotação do dólar não disponível')
        }

        const financialInstitution = financialInstitutions.find(
          (institution) => institution.id === card.financial_institution_id,
        )

        if (!financialInstitution) {
          throw new Error('Instituição financeira não encontrada')
        }

        const dollarQuotesWithMarkup =
          card.points_currency === 'USD' && dollar_quotes
            ? dollar_quotes.exchange_rate * (1 + financialInstitution.markup)
            : undefined

        // Valor gasto está em reais
        // Se o cartão converte em dolar, primeiro precisamos converter a compra para dolar
        let amountInDollar
        let earned_points
        let required_spending
        let required_months

        if (simulation_type === 'purchase' && amount) {
          if (card.points_currency === 'BRL') {
            // Pontos ganhos com a compra
            earned_points = Math.floor(amount * card.points_conversion_rate)
          } else if (card.points_currency === 'USD' && dollarQuotesWithMarkup) {
            amountInDollar = amount / dollarQuotesWithMarkup
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
          if (card.points_currency === 'BRL') {
            const totalValue = desired_points / card.points_conversion_rate // Valor total gasto em Reais
            required_spending = totalValue / months
          } else if (card.points_currency === 'USD' && dollarQuotesWithMarkup) {
            const totalValue = desired_points / card.points_conversion_rate // Valor total gasto em Dolar
            const totalValueInBRL = totalValue * dollarQuotesWithMarkup
            required_spending = totalValueInBRL / months
          }
        }

        if (
          simulation_type === 'period' &&
          desired_points &&
          monthly_spending
        ) {
          if (card.points_currency === 'BRL') {
            // Tempo necessário para atingir os pontos desejados
            const pointsPerMonth = Math.floor(
              monthly_spending * card.points_conversion_rate,
            )

            required_months = Math.ceil(desired_points / pointsPerMonth)
          } else if (card.points_currency === 'USD' && dollarQuotesWithMarkup) {
            const monthlySpendingInDollar =
              monthly_spending / dollarQuotesWithMarkup
            const pointsPerMonthInDolar = Math.floor(
              monthlySpendingInDollar * card.points_conversion_rate,
            )
            required_months = Math.ceil(desired_points / pointsPerMonthInDolar)
          }
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
      simulationCards: [...simulationsCardsReturn].map((simulationCard) => {
        const card = cards.find((card) => card.id === simulationCard.card_id)
        return {
          ...simulationCard,
          card,
          financialInstitution: financialInstitutions.find(
            (institution) => institution.id === card?.financial_institution_id,
          ),
        }
      }),
    },
  })
}
