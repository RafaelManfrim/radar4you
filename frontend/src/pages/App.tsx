import {
  Text,
  HStack,
  Center,
  Heading,
  For,
  Flex,
  VStack,
  Box,
} from '@chakra-ui/react'

import { useEffect, useRef, useState } from 'react'

import { LayoutContainer } from '@/components/LayoutContainer'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { FaHourglass, FaNewspaper, FaShoppingBag } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/Form/Input'
import { api } from '@/lib/axios'
import { Cartao } from './admin/Cartoes'
import { UserCard } from './Cartoes'
import { Link, useNavigate } from 'react-router-dom'
import { toaster } from '@/components/ui/toaster'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalculatorCard } from '@/components/CalculatorCard'
import { Simulacao } from './History'

const tipos = [
  {
    value: 1,
    label: 'Pontos por Compra',
    shortLabel: 'Pontos',
    icon: FaShoppingBag,
  },
  {
    value: 2,
    label: 'Gasto Mensal',
    shortLabel: 'Gasto',
    icon: FaNewspaper,
  },
  {
    value: 3,
    label: 'Tempo Necessário',
    shortLabel: 'Tempo',
    icon: FaHourglass,
  },
]

const tipo1Schema = z.object({
  valorGasto: z.union([
    z.coerce.number().min(0.01, 'Informe o valor'),
    z.literal(''),
  ]),
  produto: z.string().optional(),
})

const tipo2Schema = z.object({
  // pontos: z.coerce.number().min(1, 'Informe o valor'),
  // meses: z.coerce.number().min(1, 'Informe o valor'),
  pontos: z.union([z.coerce.number().min(1, 'Informe o valor'), z.literal('')]),
  meses: z.union([z.coerce.number().min(1, 'Informe o valor'), z.literal('')]),
})

const tipo3Schema = z.object({
  // pontos: z.coerce.number().min(1, 'Informe o valor'),
  // gastoMensal: z.coerce.number().min(0.01, 'Informe o valor'),
  pontos: z.union([z.coerce.number().min(1, 'Informe o valor'), z.literal('')]),
  gastoMensal: z.union([
    z.coerce.number().min(0.01, 'Informe o valor'),
    z.literal(''),
  ]),
})

type Tipo1FormType = z.infer<typeof tipo1Schema>
type Tipo2FormType = z.infer<typeof tipo2Schema>
type Tipo3FormType = z.infer<typeof tipo3Schema>

export function App() {
  const responseRef = useRef<HTMLDivElement | null>(null)

  const [tipo, setTipo] = useState(1)

  const [cartoes, setCartoes] = useState<Cartao[]>()
  const [cartoesSugeridos, setCartoesSugeridos] = useState<Cartao[]>()
  const [cartoesUsuario, setCartoesUsuario] = useState<UserCard[]>()

  const [selectedCards, setSelectedCards] = useState<Cartao[]>([])

  const [simulationResponse, setSimulationResponse] = useState<Simulacao>()

  const tipo1Form = useForm<Tipo1FormType>({
    resolver: zodResolver(tipo1Schema),
    defaultValues: {
      valorGasto: '',
      produto: '',
    },
  })

  const tipo2Form = useForm<Tipo2FormType>({
    resolver: zodResolver(tipo2Schema),
    defaultValues: {
      pontos: '',
      meses: '',
    },
  })

  const tipo3Form = useForm<Tipo3FormType>({
    resolver: zodResolver(tipo3Schema),
    defaultValues: {
      pontos: '',
      gastoMensal: '',
    },
  })

  const navigate = useNavigate()

  const suggestedCardsWithoutUserCards = cartoesSugeridos?.filter((card) =>
    cartoesUsuario?.every((userCard) => userCard.card_id !== card.id),
  )

  function handleSelectCard(card: Cartao) {
    const cardIsSelected = selectedCards.some((c) => c.id === card.id)

    if (selectedCards.length >= 3 && !cardIsSelected) {
      return toaster.create({
        title: 'Ops!',
        description:
          'Você já selecionou o limite de 3 cartões para uma simulação.',
        type: 'info',
      })
    }

    setSelectedCards((current) => {
      if (current.some((c) => c.id === card.id)) {
        return current.filter((c) => c.id !== card.id)
      }

      return [...current, card]
    })
  }

  function isTipo1Form(data: unknown): data is Tipo1FormType {
    return !!data && typeof data === 'object' && 'valorGasto' in data
  }

  function isTipo2Form(data: unknown): data is Tipo2FormType {
    return (
      !!data && typeof data === 'object' && 'pontos' in data && 'meses' in data
    )
  }

  function isTipo3Form(data: unknown): data is Tipo3FormType {
    return (
      !!data &&
      typeof data === 'object' &&
      'pontos' in data &&
      'gastoMensal' in data
    )
  }

  function handleResetSelectedCards() {
    if (cartoesUsuario) {
      const cartaoUsuarioFavoritado = cartoesUsuario.find(
        (userCard) => userCard.is_favorite,
      )

      const cartaoFavoritado = cartoes?.find(
        (card) => card.id === cartaoUsuarioFavoritado?.card_id,
      )

      setSelectedCards(cartaoFavoritado ? [cartaoFavoritado] : [])
    }
  }

  async function handleSimulate(
    data: Tipo1FormType | Tipo2FormType | Tipo3FormType,
  ) {
    if (selectedCards.length < 1) {
      return toaster.create({
        title: 'Ops!',
        description: 'Selecione pelo menos 1 cartão para simular.',
        type: 'info',
      })
    }

    try {
      let response

      if (tipo === 1 && isTipo1Form(data)) {
        response = await api.post('simulations', {
          cards_ids: selectedCards.map((card) => card.id),
          simulation_type: 'purchase',
          amount: data.valorGasto,
          product: data.produto,
        })

        tipo1Form.reset()
      }

      if (tipo === 2 && isTipo2Form(data)) {
        response = await api.post('simulations', {
          cards_ids: selectedCards.map((card) => card.id),
          simulation_type: 'monthly_spending',
          desired_points: data.pontos,
          months: data.meses,
        })

        tipo2Form.reset()
      }

      if (tipo === 3 && isTipo3Form(data)) {
        response = await api.post('simulations', {
          cards_ids: selectedCards.map((card) => card.id),
          simulation_type: 'period',
          desired_points: data.pontos,
          monthly_spending: data.gastoMensal,
        })

        tipo3Form.reset()
      }

      if (response) {
        console.log(simulationResponse)
        setSimulationResponse(response.data.simulation)
      }

      handleResetSelectedCards()

      toaster.create({
        title: 'Sucesso!',
        description: 'Sua simulação foi realizada com sucesso.',
        type: 'success',
        action: {
          label: 'Visualizar',
          onClick: () => navigate('/calculadora/historico'),
        },
      })

      setTimeout(() => {
        responseRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    } catch (err) {
      console.log(err)
      toaster.create({
        title: 'Ops!',
        description: 'Ocorreu um erro ao realizar a simulação.',
        type: 'error',
      })
    }
  }

  useEffect(() => {
    async function fetchCartoes() {
      try {
        const response = await api.get('/cards')
        setCartoes(response.data.cards)
      } catch (err) {
        console.log(err)
      }
    }

    async function fetchCartoesSugeridos() {
      try {
        const response = await api.get('/cards/suggestions')
        setCartoesSugeridos(response.data.cards)
      } catch (err) {
        console.log(err)
      }
    }

    async function fetchCartoesUsuario() {
      try {
        const response = await api.get('users/cards')
        const userCards = response.data.userCards
        setCartoesUsuario(userCards)
      } catch (err) {
        console.log(err)
      }
    }

    fetchCartoes()
    fetchCartoesSugeridos()
    fetchCartoesUsuario()
  }, [])

  useEffect(() => {
    tipo1Form.reset()
    tipo2Form.reset()
    tipo3Form.reset()
  }, [tipo])

  useEffect(() => {
    handleResetSelectedCards()
  }, [cartoesUsuario])

  return (
    <div>
      <LayoutContainer>
        <Center flexDir="column">
          <Heading as="h3" textAlign="center" color="brand.title" mb="4">
            Escolha seu tipo de simulação
          </Heading>
          <SegmentedControl
            className="dark"
            size={['xs', 'xs', 'sm', 'md']}
            mb={['4', '6']}
            defaultValue="1"
            onValueChange={(e) => setTipo(Number(e.value))}
            items={tipos.map((tipo) => {
              const Icon = tipo.icon

              return {
                value: String(tipo.value),
                label: (
                  <HStack>
                    <Icon />
                    {
                      <>
                        <Text
                          as="span"
                          fontSize={['xs', 'xs', 'sm']}
                          hideBelow="sm"
                        >
                          {tipo.label}
                        </Text>
                        <Text as="span" fontSize="sm" hideFrom="sm">
                          {tipo.shortLabel}
                        </Text>
                      </>
                    }
                  </HStack>
                ),
              }
            })}
          />

          <Heading
            as="h4"
            textAlign="center"
            mb="2"
            fontSize="md"
            color="brand.title"
          >
            Meus Cartões (
            <Text as="span" fontSize="sm" color="brand.secondary">
              <Link to="/calculadora/cartoes">Adicionar</Link>
            </Text>
            )
          </Heading>

          <HStack>
            <For each={cartoesUsuario}>
              {(userCard) => {
                const cartao = cartoes?.find(
                  (card) => card.id === userCard.card_id,
                )

                if (!cartao) return null

                const isSelected =
                  cartao.id ===
                  selectedCards.find((card) => card.id === cartao.id)?.id

                return (
                  <CalculatorCard
                    key={userCard.card_id}
                    isSelected={isSelected}
                    cartao={cartao}
                    onClick={() => handleSelectCard(cartao)}
                  />
                )
              }}
            </For>
          </HStack>

          <Heading
            as="h4"
            textAlign="center"
            mb="2"
            fontSize="md"
            color="brand.title"
          >
            Sugestão de Cartões (
            <Text as="span" fontSize="sm" color="brand.secondary">
              <Link to="/calculadora/cartoes">Ver todos</Link>
            </Text>
            )
          </Heading>

          <HStack>
            <For each={suggestedCardsWithoutUserCards}>
              {(card) => {
                const isSelected =
                  card.id ===
                  selectedCards.find(
                    (selectedCard) => selectedCard.id === card.id,
                  )?.id

                return (
                  <CalculatorCard
                    key={card.id}
                    isSelected={isSelected}
                    cartao={card}
                    onClick={() => handleSelectCard(card)}
                  />
                )
              }}
            </For>
          </HStack>

          <Heading as="h3" color="brand.title" textAlign="center" mb="2">
            Preencha os valores para simular
          </Heading>

          {tipo === 1 && (
            <Flex
              w="full"
              maxW="800px"
              flexDir={['column', 'column', 'row']}
              align="flex-end"
              justify="start"
              flexWrap="wrap"
              gap="4"
              p="4"
              borderWidth={1}
              borderColor="brand.text"
              rounded="md"
            >
              <Field
                label="Valor Gasto"
                color="brand.title"
                invalid={!!tipo1Form.formState.errors.valorGasto}
                errorText={tipo1Form.formState.errors.valorGasto?.message}
                required
                flex={1}
              >
                <Input
                  register={tipo1Form.register('valorGasto', {
                    required: 'Informe o valor gasto',
                  })}
                />
              </Field>
              <Field
                label="Produto"
                color="brand.title"
                invalid={!!tipo1Form.formState.errors.produto}
                errorText={tipo1Form.formState.errors.produto?.message}
                flex={1}
              >
                <Input register={tipo1Form.register('produto')} />
              </Field>
              <Button onClick={tipo1Form.handleSubmit(handleSimulate)}>
                Simular
              </Button>
            </Flex>
          )}

          {tipo === 2 && (
            <Flex
              w="full"
              maxW="800px"
              flexDir={['column', 'column', 'row']}
              align="flex-end"
              justify="start"
              flexWrap="wrap"
              gap="4"
              p="4"
              borderWidth={1}
              borderColor="brand.text"
              rounded="md"
            >
              <Field
                label="Quantos pontos você quer acumular?"
                color="brand.title"
                invalid={!!tipo2Form.formState.errors.pontos}
                errorText={tipo2Form.formState.errors.pontos?.message}
                required
                flex={1}
              >
                <Input
                  register={tipo2Form.register('pontos', {
                    required: 'Informe a quantidade de pontos',
                  })}
                />
              </Field>
              <Field
                label="Em quantos meses?"
                color="brand.title"
                invalid={!!tipo2Form.formState.errors.meses}
                errorText={tipo2Form.formState.errors.meses?.message}
                required
                flex={1}
              >
                <Input
                  register={tipo2Form.register('meses', {
                    required: 'Informe a quantidade de meses',
                  })}
                />
              </Field>
              <Button onClick={tipo2Form.handleSubmit(handleSimulate)}>
                Simular
              </Button>
            </Flex>
          )}

          {tipo === 3 && (
            <Flex
              w="full"
              maxW="800px"
              flexDir={['column', 'column', 'row']}
              align="flex-end"
              justify="start"
              flexWrap="wrap"
              gap="4"
              p="4"
              borderWidth={1}
              borderColor="brand.text"
              rounded="md"
            >
              <Field
                label="Quantos pontos você quer acumular?"
                color="brand.title"
                invalid={!!tipo3Form.formState.errors.pontos}
                errorText={tipo3Form.formState.errors.pontos?.message}
                required
                flex={1}
              >
                <Input
                  register={tipo3Form.register('pontos', {
                    required: 'Informe a quantidade de pontos',
                  })}
                />
              </Field>
              <Field
                label="Qual seu gasto mensal?"
                color="brand.title"
                invalid={!!tipo3Form.formState.errors.gastoMensal}
                errorText={tipo3Form.formState.errors.gastoMensal?.message}
                required
                flex={1}
              >
                <Input
                  register={tipo3Form.register('gastoMensal', {
                    required: 'Informe o gasto mensal',
                  })}
                />
              </Field>

              <Button onClick={tipo3Form.handleSubmit(handleSimulate)}>
                Simular
              </Button>
            </Flex>
          )}

          {simulationResponse && (
            <VStack
              w="full"
              p="4"
              borderWidth={1}
              borderColor="brand.text"
              borderRadius="md"
              gap="2"
              mt="4"
            >
              <Heading color="brand.title" mb="1">
                Resultado da simulação
              </Heading>

              <Flex
                mb="2"
                flexDir="row"
                justify="center"
                align="center"
                wrap="wrap"
                gap="4"
                ref={responseRef}
              >
                {simulationResponse.simulationCards.map((simulationCard) => {
                  return (
                    <Flex
                      flexDir="column"
                      key={simulationCard.card.id}
                      justify="center"
                      align="center"
                      textAlign="center"
                      gap="2"
                      flex="1"
                    >
                      <Text
                        color="brand.title"
                        fontWeight="bold"
                        fontSize={['xs', 'xs', 'md']}
                        lineClamp="1"
                      >
                        {simulationCard.card.title}
                      </Text>
                      <Flex
                        w="140px"
                        h="140px"
                        borderRadius="full"
                        bg="brand.primary"
                        p="4"
                        flexDir="column"
                        justify="center"
                        align="center"
                        borderWidth={1}
                        borderColor="brand.secondary"
                      >
                        <Box
                          color="brand.title"
                          fontSize={['xs', 'xs', 'sm']}
                          textAlign="center"
                        >
                          {simulationResponse.simulation_type === 'purchase' ? (
                            <Box>
                              <Text as="span">Pontos Ganhos: </Text>
                              <Text
                                as="span"
                                fontWeight="semibold"
                                color="brand.secondary"
                              >
                                {simulationCard.earned_points}
                              </Text>
                            </Box>
                          ) : simulationResponse.simulation_type ===
                            'monthly_spending' ? (
                            <Box>
                              <Text as="span">Gasto Mensal Necessário: </Text>
                              <Text
                                as="span"
                                fontWeight="semibold"
                                color="brand.secondary"
                              >
                                {Intl.NumberFormat('pt-BR', {
                                  currency: 'BRL',
                                  style: 'currency',
                                }).format(
                                  simulationCard.required_spending || 0,
                                )}
                              </Text>
                            </Box>
                          ) : (
                            <Box>
                              <Text as="span">Meses Necessários: </Text>
                              <Text
                                as="span"
                                fontWeight="semibold"
                                color="brand.secondary"
                              >
                                {simulationCard.required_months}
                              </Text>
                            </Box>
                          )}
                        </Box>
                      </Flex>
                    </Flex>
                  )
                })}
              </Flex>
            </VStack>
          )}
        </Center>
      </LayoutContainer>
    </div>
  )
}
