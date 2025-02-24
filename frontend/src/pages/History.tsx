import { useEffect, useState } from 'react'
import {
  Box,
  Flex,
  VStack,
  SelectRoot,
  SelectLabel,
  SelectTrigger,
  SelectContent,
  SelectItem,
  createListCollection,
  SelectValueText,
} from '@chakra-ui/react'

import { toaster } from '@/components/ui/toaster'

import { api } from '@/lib/axios'
import { getMoedaByCurrency } from '@/utils/getMoedaByCurrency'

type SimulationCard = {
  id: string
  card: {
    title: string
    points_conversion_rate: number
    points_currency: string
  }
  earned_points?: number
  required_spending?: number
  required_months?: number
}

type Simulacao = {
  id: string
  simulation_type: string
  created_at: string
  amount?: number
  desired_points?: number
  months?: number
  monthly_spending?: number
  simulationCards: SimulationCard[]
}

const periodFilterOptions = createListCollection({
  items: [
    { value: '', label: 'Todas' },
    { value: '7d', label: 'Últimos 7 dias' },
    { value: '30d', label: 'Últimos 30 dias' },
    { value: '90d', label: 'Últimos 90 dias' },
  ]
})

const typeFilterOptions = createListCollection({
  items: [
    { value: '', label: 'Todos' },
    { value: 'purchase', label: 'Pontos por Compra' },
    { value: 'monthly_spending', label: 'Encontrar Gasto Mensal' },
    { value: 'time', label: 'Descobrir Tempo Necessário' },
  ]
})

export function History() {
  const [simulacoes, setSimulacoes] = useState<Simulacao[]>()
  const [periodFilterValue, setPeriodFilterValue] = useState<string[]>([''])
  const [typeFilterValue, setTypeFilterValue] = useState<string[]>([''])

  async function handleDeleteSimulation(id: string) {
    try {
      await api.delete(`simulations/${id}`)
      setSimulacoes((prevSimulacoes) => {
        if (!prevSimulacoes) {
          return []
        }

        return prevSimulacoes.filter((simulacao) => simulacao.id !== id)
      })
    } catch (error) {
      console.log(error)

      toaster.create({
        title: 'Erro ao deletar simulação',
        description:
          'Ocorreu um erro ao deletar a simulação, tente novamente mais tarde.',
        type: 'error',
        duration: 3000,
      })
    }
  }

  useEffect(() => {
    async function fetchSimulacoes() {
      try {
        const response = await api.get('simulations')
        setSimulacoes(response.data.simulations)
      } catch (error) {
        console.log(error)

        toaster.create({
          title: 'Erro ao buscar simulações',
          description:
            'Ocorreu um erro ao buscar as simulações, tente novamente mais tarde.',
          type: 'error',
          duration: 3000,
        })
      }
    }

    fetchSimulacoes()
  }, [])

  return (
    <Flex w="full" justify="center" p="6">
      <Flex
        flexDir="column"
        justify="center"
        align="center"
        w="full"
        maxW={1280}
        gap="6"
      >
        <Box as="h1" fontSize="2xl" fontWeight="bold">
          Histórico de Simulações
        </Box>
        <Box as="h2" fontSize="lg" fontWeight="semibold">
          Filtros (Em Breve)
        </Box>
        <Flex w="full" justify="center" align="center" gap="4">
          {/* Filtro por tipo de simulação */}
          <SelectRoot
            collection={typeFilterOptions}
            width="320px"
            value={typeFilterValue}
            onValueChange={(e) => setTypeFilterValue(e.value)}
          >
            <SelectLabel>Selecione o tipo de simulação</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Selecione o tipo de simulação" />
            </SelectTrigger>
            <SelectContent>
              {typeFilterOptions.items.map((type) => (
                <SelectItem item={type} key={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>

          {/* Filtro por período */}
          <SelectRoot
            collection={periodFilterOptions}
            width="320px"
            value={periodFilterValue}
            onValueChange={(e) => setPeriodFilterValue(e.value)}
          >
            <SelectLabel>Selecione o período de visualização</SelectLabel>
            <SelectTrigger>
              <SelectValueText placeholder="Selecione o período de visualização" />
            </SelectTrigger>
            <SelectContent>
              {periodFilterOptions.items.map((period) => (
                <SelectItem item={period} key={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </Flex>

        <Box as="h2" fontSize="lg" fontWeight="semibold">
          Simulações
        </Box>
        <VStack gap="4" w="full">
          {simulacoes?.map((simulacao) => {
            return (
              <VStack key={simulacao.id} bgColor="gray.50" p="4" w="full">
                <Flex w="full" justify="space-between">
                  <Box>
                    <Box as="strong">
                      Tipo:{' '}
                      {simulacao.simulation_type === 'purchase'
                        ? 'Pontos por Compra'
                        : simulacao.simulation_type === 'monthly_spending'
                          ? 'Encontrar Gasto Mensal'
                          : 'Descobrir Tempo Necessário'}{' '}
                    </Box>
                    ({new Date(simulacao.created_at).toLocaleString()})
                  </Box>
                  <Box>
                    <Box
                      onClick={() => handleDeleteSimulation(simulacao.id)}
                      color="purple.500"
                      cursor="pointer"
                      textAlign="right"
                      _hover={{
                        color: 'purple.600',
                        textDecoration: 'underline',
                      }}
                    >
                      Excluir
                    </Box>
                  </Box>
                </Flex>

                <Flex align="start" justify="start" w="full">
                  {simulacao.simulation_type === 'purchase' ? (
                    <Box>
                      Gasto{' '}
                      {Intl.NumberFormat('pt-BR', {
                        currency: 'BRL',
                        style: 'currency',
                      }).format(simulacao.amount || 0)}
                    </Box>
                  ) : simulacao.simulation_type === 'monthly_spending' ? (
                    <VStack align="start" justify="start">
                      <Box>
                        Desejados {simulacao.desired_points} Pontos em{' '}
                        {simulacao.months}{' '}
                        {simulacao.months === 1 ? 'mês' : 'meses'}
                      </Box>
                    </VStack>
                  ) : (
                    <VStack>
                      <Box>
                        Desejados {simulacao.desired_points} Pontos com Gasto
                        Mensal de{' '}
                        {Intl.NumberFormat('pt-BR', {
                          currency: 'BRL',
                          style: 'currency',
                        }).format(simulacao.monthly_spending || 0)}
                      </Box>
                    </VStack>
                  )}
                </Flex>
                <VStack gap="2" w="full">
                  {simulacao.simulationCards.map((simulationCard) => {
                    return (
                      <Flex
                        key={simulationCard.id}
                        gap="2"
                        p="2"
                        bg="gray.100"
                        w="full"
                      >
                        <Box>{simulationCard.card.title}</Box>
                        <Box>
                          ({simulationCard.card.points_conversion_rate} ponto
                          {simulationCard.card.points_conversion_rate !== 1 &&
                            's'}{' '}
                          /{' '}
                          {getMoedaByCurrency(
                            simulationCard.card.points_currency,
                          ).toLocaleLowerCase()}
                          )
                        </Box>
                        <Box>
                          {simulacao.simulation_type === 'purchase' ? (
                            <Box>
                              Pontos Ganhos: {simulationCard.earned_points}
                            </Box>
                          ) : simulacao.simulation_type ===
                            'monthly_spending' ? (
                            <Box>
                              Gasto Mensal Necessário:{' '}
                              {Intl.NumberFormat('pt-BR', {
                                currency: 'BRL',
                                style: 'currency',
                              }).format(simulationCard.required_spending || 0)}
                            </Box>
                          ) : (
                            <Box>
                              Meses Necessários:{' '}
                              {simulationCard.required_months}
                            </Box>
                          )}
                        </Box>
                      </Flex>
                    )
                  })}
                </VStack>
              </VStack>
            )
          })}
        </VStack>
      </Flex>
    </Flex>
  )
}
