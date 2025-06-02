import { Cartao } from '@/pages/admin/Cartoes'
import { Simulacao } from '@/pages/History'

export type BestResult = {
  card: Cartao
  earned_points?: number
  required_spending?: number
  required_months?: number
}

export function getBestResult(simulation: Simulacao) {
  let bestResult: BestResult | null = null

  if (simulation.simulation_type === 'purchase') {
    bestResult = simulation.simulationCards.reduce(
      (best, current) => {
        if (!best || (current.earned_points || 0) > best.earned_points) {
          return {
            card: current.card,
            earned_points: current.earned_points || 0,
          }
        }

        return best
      },
      { card: simulation.simulationCards[0].card, earned_points: 0 },
    )
  } else if (simulation.simulation_type === 'monthly_spending') {
    const worstRequiredSpending = Math.max(
      ...simulation.simulationCards.map((c) => c.required_spending || 0),
    )

    bestResult = simulation.simulationCards.reduce(
      (best, current) => {
        if (
          !best ||
          (current.required_spending || worstRequiredSpending) <
            best.required_spending
        ) {
          return {
            card: current.card,
            required_spending: current.required_spending || 0,
          }
        }
        return best
      },
      {
        card: simulation.simulationCards[0].card,
        required_spending: worstRequiredSpending,
      },
    )
  } else {
    const worstRequiredMonths = Math.max(
      ...simulation.simulationCards.map((c) => c.required_months || 0),
    )

    bestResult = simulation.simulationCards.reduce(
      (best, current) => {
        if (
          !best ||
          (current.required_months || worstRequiredMonths) <
            best.required_months
        ) {
          return {
            card: current.card,
            required_months: current.required_months || worstRequiredMonths,
          }
        }
        return best
      },
      {
        card: simulation.simulationCards[0].card,
        required_months: worstRequiredMonths,
      },
    )
  }

  return bestResult
}
