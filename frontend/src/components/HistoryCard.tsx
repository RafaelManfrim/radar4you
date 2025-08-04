import { Simulacao, SimulationCard } from '@/pages/History'
import { formatNumberToPortuguese } from '@/utils/formatNumberToPortuguese'
import { BestResult } from '@/utils/getBestResult'
import { getMoedaByCurrency } from '@/utils/getMoedaByCurrency'
import { Box, Flex, Text } from '@chakra-ui/react'

interface HistoryCardProps {
  simulationCard: SimulationCard
  simulacao: Simulacao
  bestResult: BestResult
}

export function HistoryCard({
  simulationCard,
  simulacao,
  bestResult,
}: HistoryCardProps) {
  const isBestResult = bestResult.card.id === simulationCard.card.id

  const formattedPointsConversionRate = formatNumberToPortuguese(
    simulationCard.card.points_conversion_rate,
  )

  return (
    <Flex
      key={simulationCard.id}
      gap="2"
      p="1"
      bgColor="brand.background"
      w="full"
      justify="space-between"
      fontSize={['sm', 'md']}
      flexDir={['column', 'row']}
      borderWidth={0.5}
      borderColor={isBestResult ? 'brand.warning' : 'brand.background'}
    >
      <Flex
        flexDir={['column', 'row']}
        gap={[0, '1']}
        align={['start', 'center']}
      >
        <Text as="strong" color="brand.title">
          {simulationCard.card.title}
        </Text>
        <Text as="span" color="brand.text" fontSize="xs">
          ({formattedPointsConversionRate} ponto
          {simulationCard.card.points_conversion_rate !== 1 && 's'} /{' '}
          {getMoedaByCurrency(
            simulationCard.card.points_currency,
          ).toLocaleLowerCase()}
          )
        </Text>
        {simulationCard.card.points_currency === 'USD' && (
          <Text as="span" color="brand.text" fontSize="xs">
            Spread:{' '}
            {Intl.NumberFormat('pt-BR', {
              style: 'percent',
              maximumFractionDigits: 2,
            }).format((simulationCard.financialInstitution.markup ?? 0) / 100)}
          </Text>
        )}
      </Flex>
      <Box color="brand.title">
        {simulacao.simulation_type === 'purchase' ? (
          <Box>
            <Text as="span">Pontos/Milhas: </Text>
            <Text as="span" fontWeight="semibold" color="brand.secondary">
              {formatNumberToPortuguese(simulationCard.earned_points || 0)}
            </Text>
          </Box>
        ) : simulacao.simulation_type === 'monthly_spending' ? (
          <Box>
            <Text as="span">Gasto Mensal Necessário: </Text>
            <Text as="span" fontWeight="semibold" color="brand.secondary">
              {Intl.NumberFormat('pt-BR', {
                currency: 'BRL',
                style: 'currency',
              }).format(simulationCard.required_spending || 0)}
            </Text>
          </Box>
        ) : (
          <Box>
            <Text as="span">Meses Necessários: </Text>
            <Text as="span" fontWeight="semibold" color="brand.secondary">
              {simulationCard.required_months}
            </Text>
          </Box>
        )}
      </Box>
    </Flex>
  )
}
