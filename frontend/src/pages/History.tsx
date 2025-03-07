import { useEffect, useState } from 'react'
import { Flex, VStack, Heading, Show } from '@chakra-ui/react'

import { toaster } from '@/components/ui/toaster'

import { api } from '@/lib/axios'
import { Skeleton } from '@/components/ui/skeleton'
import { HistoryCardContainer } from '@/components/HistoryCardContainer'
import { Filters, FilterValue } from '@/components/Filters'
import { CheckedChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/checkbox/namespace'
import { NoItemsMessageCard } from './NoItemsMessageCard'

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

// const periodFilterOptions = createListCollection({
//   items: [
//     { value: '', label: 'Todas' },
//     { value: '7d', label: 'Últimos 7 dias' },
//     { value: '30d', label: 'Últimos 30 dias' },
//     { value: '90d', label: 'Últimos 90 dias' },
//   ],
// })

export function History() {
  const [simulacoes, setSimulacoes] = useState<Simulacao[]>()
  // const [periodFilterValue, setPeriodFilterValue] = useState<string[]>([''])
  const [typesFilter, setTypesFilter] = useState<FilterValue[]>([
    { value: 'purchase', label: 'Pontos por Compra', checked: false },
    {
      value: 'monthly_spending',
      label: 'Encontrar Gasto Mensal',
      checked: false,
    },
    { value: 'period', label: 'Descobrir Tempo Necessário', checked: false },
  ])

  function handleRootTypesClick(e: CheckedChangeDetails) {
    setTypesFilter((current) =>
      current.map((value) => ({ ...value, checked: !!e.checked })),
    )
  }

  function handleItemTypeClick(e: CheckedChangeDetails, index: number) {
    setTypesFilter((current) => {
      const newValues = [...current]
      newValues[index] = { ...newValues[index], checked: !!e.checked }
      return newValues
    })
  }

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
        })
      }
    }

    fetchSimulacoes()
  }, [])

  const filteredSimulations = simulacoes?.filter((simulacao) => {
    if (typesFilter.some((value) => value.checked)) {
      const typeFilter = typesFilter.find(
        (filter) => filter.value === simulacao.simulation_type,
      )
      if (!typeFilter?.checked) {
        return false
      }
    }

    return true
  })

  return (
    <Flex w="full" justify="center" p="6">
      <Flex
        justify="start"
        align="start"
        gap="4"
        w="full"
        maxW={1280}
        flexDir={['column', 'column', 'row']}
      >
        <VStack
          align="start"
          p="4"
          borderWidth={1}
          borderColor="brand.text"
          borderRadius="md"
          gap="4"
          w="full"
          maxW={['none', 'none', '250px']}
        >
          <Heading color="brand.title" alignSelf="center" mb="1">
            Filtros
          </Heading>
          <Filters
            title="Tipos"
            values={typesFilter}
            onRootClick={handleRootTypesClick}
            onItemClick={handleItemTypeClick}
          />
        </VStack>
        <VStack
          w="full"
          p="4"
          borderWidth={1}
          borderColor="brand.text"
          borderRadius="md"
          gap="2"
        >
          <Heading color="brand.title" mb="1">
            Histórico de Simulações
          </Heading>
          <Show
            when={filteredSimulations}
            children={filteredSimulations?.map((simulacao) => {
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

          {filteredSimulations?.length === 0 && (
            <NoItemsMessageCard message="Nenhuma simulação encontrada com os filtros selecionados" />
          )}
        </VStack>
      </Flex>
    </Flex>
  )
}
