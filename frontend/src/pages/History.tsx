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
  Heading,
  Show,
} from '@chakra-ui/react'

import { toaster } from '@/components/ui/toaster'

import { api } from '@/lib/axios'
import { Skeleton } from '@/components/ui/skeleton'
import { HistoryCardContainer } from '@/components/HistoryCardContainer'

export type SimulationCard = {
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

export type Simulacao = {
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
  ],
})

const typeFilterOptions = createListCollection({
  items: [
    { value: '', label: 'Todos' },
    { value: 'purchase', label: 'Pontos por Compra' },
    { value: 'monthly_spending', label: 'Encontrar Gasto Mensal' },
    { value: 'time', label: 'Descobrir Tempo Necessário' },
  ],
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
      <Flex justify="start" align="start" gap="4" w="full" maxW={1280}>
        <VStack
          w="full"
          p="4"
          borderWidth={1}
          borderColor="brand.text"
          borderRadius="md"
          gap="2"
        >
          <Heading color="brand.title">Histórico de Simulações</Heading>
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
          <Show
            when={simulacoes}
            children={simulacoes?.map((simulacao) => {
              return (
                <HistoryCardContainer
                  key={simulacao.id}
                  simulacao={simulacao}
                  onDeleteSimulacao={handleDeleteSimulation}
                />
              )
            })}
            fallback={Array.from({ length: 3 }, (_, i) => i).map((_, index) => (
              <Skeleton
                key={index}
                className="dark"
                variant="shine"
                height="16"
                w="full"
              />
            ))}
          />
        </VStack>
      </Flex>
    </Flex>
  )
}
