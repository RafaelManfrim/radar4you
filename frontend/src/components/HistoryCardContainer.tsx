import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { Simulacao } from '@/pages/History'
import { HistoryCard } from './HistoryCard'

interface HistoryCardContainerProps {
  simulacao: Simulacao
  onDeleteSimulacao: (id: string) => Promise<void>
}

export function HistoryCardContainer({
  simulacao,
  onDeleteSimulacao,
}: HistoryCardContainerProps) {
  return (
    <VStack
      key={simulacao.id}
      bgColor="brand.text-transparent"
      p="2"
      borderRadius="sm"
      w="full"
    >
      <Flex
        w="full"
        justify="space-between"
        borderBottomWidth={1}
        borderColor="brand.background"
        pb="2"
      >
        <Heading fontSize="md" color="brand.title">
          <Heading as="strong" fontSize="md">
            Tipo:{' '}
            {simulacao.simulation_type === 'purchase'
              ? 'Pontos por Compra'
              : simulacao.simulation_type === 'monthly_spending'
                ? 'Encontrar Gasto Mensal'
                : 'Descobrir Tempo Necessário'}{' '}
          </Heading>
          ({new Date(simulacao.created_at).toLocaleString()})
        </Heading>

        <Text
          cursor="pointer"
          textAlign="right"
          color="brand.danger"
          _hover={{
            filter: 'brightness(0.9)',
            transition: '0.2s ease',
            textDecoration: 'underline',
          }}
          onClick={() => onDeleteSimulacao(simulacao.id)}
        >
          Excluir
        </Text>
      </Flex>

      <Flex align="start" justify="start" w="full" color="brand.title">
        {simulacao.simulation_type === 'purchase' ? (
          <Box>
            <Text as="span">Gasto</Text>{' '}
            <Text as="span" fontWeight="semibold" color="brand.secondary">
              {Intl.NumberFormat('pt-BR', {
                currency: 'BRL',
                style: 'currency',
              }).format(simulacao.amount || 0)}
            </Text>
          </Box>
        ) : simulacao.simulation_type === 'monthly_spending' ? (
          <Box>
            <Text as="span">Desejados </Text>
            <Text as="span" fontWeight="semibold" color="brand.secondary">
              {simulacao.desired_points}
            </Text>{' '}
            <Text as="span">Pontos em </Text>
            <Text as="span" fontWeight="semibold" color="brand.secondary">
              {simulacao.months} {simulacao.months === 1 ? 'mês' : 'meses'}
            </Text>
          </Box>
        ) : (
          <Box>
            <Text as="span">Desejados </Text>
            <Text as="span" fontWeight="semibold" color="brand.secondary">
              {simulacao.desired_points}
            </Text>{' '}
            <Text as="span">Pontos com Gasto Mensal de </Text>
            <Text as="span" fontWeight="semibold" color="brand.secondary">
              {Intl.NumberFormat('pt-BR', {
                currency: 'BRL',
                style: 'currency',
              }).format(simulacao.monthly_spending || 0)}
            </Text>
          </Box>
        )}
      </Flex>
      <VStack gap="2" w="full">
        {simulacao.simulationCards.map((simulationCard) => {
          return (
            <HistoryCard
              key={simulationCard.id}
              simulationCard={simulationCard}
              simulacao={simulacao}
            />
          )
        })}
      </VStack>
    </VStack>
  )
}
