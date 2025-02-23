import { Text, HStack, Center, Flex, VStack } from '@chakra-ui/react'

import { useEffect, useState } from 'react'

import { LayoutContainer } from '@/components/LayoutContainer'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { FaHourglass, FaNewspaper, FaShoppingBag } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/Form/Input'
import { api } from '@/lib/axios'
import { Cartao } from './admin/Cartoes'
import { UserCard } from './Cartoes'
import { Link } from 'react-router-dom'
import { toaster } from '@/components/ui/toaster'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
// import {
//   RadioCardItem,
//   RadioCardLabel,
//   RadioCardRoot,
// } from '@/components/ui/radio-card'

const tipos = [
  { value: 1, label: 'Pontos por Compra', icon: FaShoppingBag },
  { value: 2, label: 'Encontrar Gasto Mensal', icon: FaNewspaper },
  { value: 3, label: 'Descobrir Tempo Necessário', icon: FaHourglass },
]

const tipo1Schema = z.object({
  valorGasto: z.number(),
})

const tipo2Schema = z.object({
  pontos: z.number(),
  meses: z.number(),
})

const tipo3Schema = z.object({
  pontos: z.number(),
  gastoMensal: z.number(),
})

type Tipo1FormType = z.infer<typeof tipo1Schema>
type Tipo2FormType = z.infer<typeof tipo2Schema>
type Tipo3FormType = z.infer<typeof tipo3Schema>

export function App() {
  const [tipo, setTipo] = useState(1)

  const [cartoes, setCartoes] = useState<Cartao[]>()
  const [cartoesUsuario, setCartoesUsuario] = useState<UserCard[]>()

  const [selectedCards, setSelectedCards] = useState<Cartao[]>([])

  const tipo1Form = useForm<Tipo1FormType>({
    resolver: zodResolver(tipo1Schema),
  })

  const tipo2Form = useForm<Tipo2FormType>({
    resolver: zodResolver(tipo2Schema),
  })

  const tipo3Form = useForm<Tipo3FormType>({
    resolver: zodResolver(tipo3Schema),
  })

  function handleSelectCard(card: Cartao) {
    const cardIsSelected = selectedCards.some((c) => c.id === card.id)

    if (selectedCards.length >= 3 && !cardIsSelected) {
      return toaster.create({
        title: 'Ops!',
        description:
          'Você já selecionou o limite de 3 cartões para uma simulação.',
        type: 'info',
        duration: 2000,
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

  async function handleSimulate(
    data: Tipo1FormType | Tipo2FormType | Tipo3FormType,
  ) {
    if (selectedCards.length < 1) {
      return toaster.create({
        title: 'Ops!',
        description: 'Selecione pelo menos 1 cartão para simular.',
        type: 'info',
        duration: 2000,
      })
    }

    if (tipo === 1 && isTipo1Form(data)) {
      await api.post('simulations', {
        cards_ids: selectedCards.map((card) => card.id),
        simulation_type: 'purchase',
        amount: data.valorGasto,
      })

      tipo1Form.reset()
    }

    if (tipo === 2 && isTipo2Form(data)) {
      await api.post('simulations', {
        cards_ids: selectedCards.map((card) => card.id),
        simulation_type: 'monthly_spending',
        desired_points: data.pontos,
        months: data.meses,
      })

      tipo2Form.reset()
    }

    if (tipo === 3 && isTipo3Form(data)) {
      api.post('simulations', {
        cards_ids: selectedCards.map((card) => card.id),
        simulation_type: 'period',
        desired_points: data.pontos,
        monthly_spending: data.gastoMensal,
      })

      tipo3Form.reset()
    }

    toaster.create({
      title: 'Sucesso!',
      description: 'Sua simulação foi realizada com sucesso.',
      type: 'success',
      duration: 2000,
    })
  }

  useEffect(() => {
    async function fetchCartoes() {
      try {
        const response = await api.get('cards')
        setCartoes(response.data.cards)
      } catch (err) {
        console.log(err)
      }
    }

    async function fetchCartoesUsuario() {
      try {
        const response = await api.get('user/cards')
        const userCards = response.data.userCards
        setCartoesUsuario(userCards)
      } catch (err) {
        console.log(err)
      }
    }

    fetchCartoes()
    fetchCartoesUsuario()
  }, [])

  return (
    <div>
      <LayoutContainer>
        {/* <Text as="h1" textAlign="center">
          Calculadora
        </Text> */}

        {/* <RadioCardRoot defaultValue="1" mb="6">
          <RadioCardLabel>
            <Text as="h2" fontSize="xl">
              Selecione o Tipo de Calculadora
            </Text>
          </RadioCardLabel>
          <HStack align="stretch">
            {tipos.map((tipo) => (
              <RadioCardItem
                label={tipo.label}
                key={tipo.value}
                value={String(tipo.value)}
                onClick={() => setTipo(tipo.value)}
                cursor="pointer"
              />
            ))}
          </HStack>
        </RadioCardRoot> */}

        <Center flexDir="column">
          <SegmentedControl
            size={['xs', 'xs', 'sm', 'md']}
            mb="6"
            defaultValue="1"
            onValueChange={(e) => setTipo(Number(e.value))}
            items={tipos.map((tipo) => {
              const Icon = tipo.icon

              return {
                value: String(tipo.value),
                label: (
                  <HStack>
                    <Icon />
                    {tipo.label}
                  </HStack>
                ),
              }
            })}
          />

          <Text as="h2" textAlign="center" mb="2">
            Meus Cartões
            <Text fontSize="sm" color="purple.500">
              <Link to="/calculadora/cartoes">Adicionar</Link>
            </Text>
          </Text>

          <HStack>
            {cartoesUsuario?.map((cartao) => (
              <Flex
                key={cartao.id}
                w="full"
                maxW={400}
                bgColor="gray.100"
                p="4"
                rounded="md"
                align="center"
                justify="space-between"
                mb="4"
                fontSize="sm"
                cursor="pointer"
                _hover={{
                  filter: 'brightness(0.97)',
                  transition: 'filter 0.2s',
                }}
                onClick={() =>
                  handleSelectCard(
                    cartoes?.find(
                      (card) => card.id === cartao.card_id,
                    ) as Cartao,
                  )
                }
                {...(cartao.card_id ===
                  selectedCards.find((card) => card.id === cartao.card_id)
                    ?.id && {
                  bgColor: 'purple.100',
                })}
              >
                <Text>
                  {cartoes?.find((card) => card.id === cartao.card_id)?.title}
                </Text>
              </Flex>
            ))}
          </HStack>

          <Text as="h2" textAlign="center" mb="2">
            Sujestão de Cartões
            <Text fontSize="sm" color="purple.500">
              <Link to="/calculadora/cartoes">Ver todos</Link>
            </Text>
          </Text>

          <HStack>
            {cartoes
              ?.filter((card) =>
                cartoesUsuario?.every(
                  (userCard) => userCard.card_id !== card.id,
                ),
              )
              .map((cartao) => (
                <Flex
                  key={cartao.id}
                  w="full"
                  maxW={400}
                  bgColor="gray.100"
                  p="4"
                  rounded="md"
                  align="center"
                  justify="space-between"
                  mb="4"
                  fontSize="sm"
                  cursor="pointer"
                  _hover={{
                    filter: 'brightness(0.97)',
                    transition: 'filter 0.2s',
                  }}
                  onClick={() =>
                    handleSelectCard(
                      cartoes?.find((card) => card.id === cartao.id) as Cartao,
                    )
                  }
                  {...(selectedCards.some((card) => card.id === cartao.id) && {
                    bgColor: 'purple.100',
                  })}
                >
                  <Text>{cartao.title}</Text>
                </Flex>
              ))}
          </HStack>

          <Text as="h2" textAlign="center" mb="2">
            Simulação
          </Text>

          {tipo === 1 && (
            <VStack
              w="full"
              maxW={400}
              bgColor="gray.100"
              p="4"
              rounded="md"
              align="end"
            >
              <Field
                label="Valor Gasto"
                invalid={!!tipo1Form.formState.errors.valorGasto}
                errorText={tipo1Form.formState.errors.valorGasto?.message}
                required
              >
                <Input
                  register={tipo1Form.register('valorGasto', {
                    required: 'Informe o valor gasto',
                    valueAsNumber: true,
                  })}
                />
              </Field>
              <Button onClick={tipo1Form.handleSubmit(handleSimulate)}>
                Calcular
              </Button>
            </VStack>
          )}

          {tipo === 2 && (
            <VStack
              w="full"
              maxW={400}
              bgColor="gray.100"
              p="4"
              rounded="md"
              align="end"
            >
              <Field
                label="Quantos pontos você quer acumular?"
                invalid={!!tipo2Form.formState.errors.pontos}
                errorText={tipo2Form.formState.errors.pontos?.message}
                required
              >
                <Input
                  register={tipo2Form.register('pontos', {
                    required: 'Informe a quantidade de pontos',
                    valueAsNumber: true,
                  })}
                />
              </Field>
              <Field
                label="Em quantos meses?"
                invalid={!!tipo2Form.formState.errors.meses}
                errorText={tipo2Form.formState.errors.meses?.message}
                required
              >
                <Input
                  register={tipo2Form.register('meses', {
                    required: 'Informe a quantidade de meses',
                    valueAsNumber: true,
                  })}
                />
              </Field>
              <Button onClick={tipo2Form.handleSubmit(handleSimulate)}>
                Calcular
              </Button>
            </VStack>
          )}

          {tipo === 3 && (
            <VStack
              w="full"
              maxW={400}
              bgColor="gray.100"
              p="4"
              rounded="md"
              align="end"
            >
              <Field
                label="Quantos pontos você quer acumular?"
                invalid={!!tipo3Form.formState.errors.pontos}
                errorText={tipo3Form.formState.errors.pontos?.message}
                required
              >
                <Input
                  register={tipo3Form.register('pontos', {
                    required: 'Informe a quantidade de pontos',
                    valueAsNumber: true,
                  })}
                />
              </Field>
              <Field
                label="Qual seu gasto mensal?"
                invalid={!!tipo3Form.formState.errors.gastoMensal}
                errorText={tipo3Form.formState.errors.gastoMensal?.message}
                required
              >
                <Input
                  register={tipo3Form.register('gastoMensal', {
                    required: 'Informe o gasto mensal',
                    valueAsNumber: true,
                  })}
                />
              </Field>

              <Button onClick={tipo3Form.handleSubmit(handleSimulate)}>
                Calcular
              </Button>
            </VStack>
          )}
        </Center>
      </LayoutContainer>
    </div>
  )
}
