import { Simulacao, SimulationCard } from '@/pages/History'
import { getMoedaByCurrency } from '@/utils/getMoedaByCurrency'
import { Box, Flex, Text } from '@chakra-ui/react'

interface HistoryCardProps {
  simulationCard: SimulationCard
  simulacao: Simulacao
}

export function HistoryCard({ simulationCard, simulacao }: HistoryCardProps) {
  return (
    <Flex
      key={simulationCard.id}
      gap="2"
      p="2"
      bgColor="brand.background"
      w="full"
      justify="space-between"
      fontSize={['sm', 'md']}
      flexDir={['column', 'row']}
    >
      <Flex flexDir={['column', 'row']} gap={[0, '1']}>
        <Text as="strong" color="brand.title">
          {simulationCard.card.title}
        </Text>
        <Text as="span" color="brand.secondary">
          ({simulationCard.card.points_conversion_rate} ponto
          {simulationCard.card.points_conversion_rate !== 1 && 's'} /{' '}
          {getMoedaByCurrency(
            simulationCard.card.points_currency,
          ).toLocaleLowerCase()}
          )
        </Text>
        {simulationCard.card.points_currency === 'USD' && (
          <Text as="span" color="brand.text">
            Ágio:{' '}
            {Intl.NumberFormat('pt-BR', {
              style: 'percent',
            }).format((simulationCard.financialInstitution.markup ?? 0) / 100)}
          </Text>
        )}
      </Flex>
      <Box color="brand.title">
        {simulacao.simulation_type === 'purchase' ? (
          <Box>
            <Text as="span">Pontos Ganhos: </Text>
            <Text as="span" fontWeight="semibold" color="brand.secondary">
              {simulationCard.earned_points}
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
