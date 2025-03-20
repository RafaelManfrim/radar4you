import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/react'
import { Simulacao } from '@/pages/History'
import { HistoryCard } from './HistoryCard'
import { RemoveWithConfirmationPopoverButton } from './RemoveWithConfirmationPopoverButton'
import { useState } from 'react'

interface HistoryCardContainerProps {
  simulacao: Simulacao
  onDeleteSimulacao?: (id: string) => Promise<void>
}

export function HistoryCardContainer({
  simulacao,
  onDeleteSimulacao,
}: HistoryCardContainerProps) {
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)

  return (
    <VStack
      key={simulacao.id}
      bgColor="brand.text-transparent"
      borderRadius="sm"
      py="3"
      px="4"
      w="full"
    >
      <Flex
        w="full"
        justify="space-between"
        borderBottomWidth={1}
        borderColor="brand.background"
        pb="2"
        align="center"
      >
        <Flex
          align={['start', 'center']}
          flexDir={['column', 'row']}
          gap={[0, '2']}
        >
          <Heading as="strong" fontSize={['sm', 'md']} color="brand.secondary">
            {simulacao.simulation_type === 'purchase'
              ? 'Pontos por Compra'
              : simulacao.simulation_type === 'monthly_spending'
                ? 'Encontrar Gasto Mensal'
                : 'Descobrir Tempo Necessário'}
          </Heading>
          <Text as="span" fontSize="xs" color="brand.text" mt={[0, '1']}>
            {new Date(simulacao.created_at).toLocaleString()}
          </Text>
        </Flex>

        {onDeleteSimulacao && (
          <RemoveWithConfirmationPopoverButton
            buttonAriaLabel="Excluir simulação"
            popoverContent={
              <Text color="brand.title" fontSize="sm" textAlign="center">
                Tem certeza que deseja excluir a simulação?
              </Text>
            }
            onRemove={() => onDeleteSimulacao(simulacao.id)}
            onOpenChange={(e) => setDeleteConfirmationOpen(e.open)}
            open={deleteConfirmationOpen}
          />
        )}
      </Flex>

      <Flex w="full" justify="space-between" align="start" gap="4">
        <Flex
          align="start"
          justify="start"
          w="full"
          color="brand.title"
          fontSize={['sm', 'md']}
        >
          {simulacao.simulation_type === 'purchase' ? (
            <Box>
              <Text as="span">Gasto</Text>{' '}
              <Text as="span" fontWeight="semibold" color="brand.secondary">
                {Intl.NumberFormat('pt-BR', {
                  currency: 'BRL',
                  style: 'currency',
                }).format(simulacao.amount || 0)}
              </Text>
              {simulacao.product && (
                <Text
                  as="span"
                  color="brand.text"
                  display={['block', 'inline']}
                >
                  {' '}
                  ({simulacao.product})
                </Text>
              )}
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
        {simulacao.simulationCards.some(
          (simulationCard) => simulationCard.card.points_currency === 'USD',
        ) && (
          <Flex
            flexDir={['column', 'row']}
            align={['end', 'center']}
            justify="end"
            color="brand.title"
            fontSize={['sm', 'md']}
            gap={[0, '1']}
          >
            <Text as="span">Dólar: </Text>
            <Text as="span" fontWeight="semibold" color="brand.secondary">
              {Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(simulacao.exchange_rate ?? 0)}
            </Text>
          </Flex>
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
