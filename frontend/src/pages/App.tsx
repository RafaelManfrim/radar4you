import { Text, HStack, Center, Flex, VStack } from '@chakra-ui/react'

import { useState } from 'react'

import { LayoutContainer } from '@/components/LayoutContainer'
import { SegmentedControl } from '@/components/ui/segmented-control'
import { FaHourglass, FaNewspaper, FaShoppingBag } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/Form/Input'
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

export function App() {
  const [tipo, setTipo] = useState(1)

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
            <Text color="purple.500">Adicionar</Text>
          </Text>

          <HStack>
            {Array.from({ length: 3 }, (_, index) => (
              <Flex
                key={index}
                w="full"
                maxW={400}
                bgColor="gray.100"
                p="4"
                rounded="md"
                align="center"
                justify="space-between"
                mb="4"
                {...(index % 2 === 1 && { bgColor: 'purple.100' })}
              >
                <Text>Cartão {index + 1}</Text>
                {/* <Button>Adicionar</Button> */}
              </Flex>
            ))}
          </HStack>

          <Text as="h2" textAlign="center" mb="2">
            Sujestão de Cartões
            <Text color="purple.500">Ver todos</Text>
          </Text>

          <HStack>
            {Array.from({ length: 5 }, (_, index) => (
              <Flex
                key={index}
                w="full"
                maxW={400}
                bgColor="gray.100"
                p="4"
                rounded="md"
                align="center"
                justify="space-between"
                mb="4"
                {...(index % 2 === 1 && { bgColor: 'purple.100' })}
              >
                <Text>Cartão {index + 1}</Text>
                {/* <Button>Adicionar</Button> */}
              </Flex>
            ))}
          </HStack>

          <Text as="h2" textAlign="center" mb="2">
            Cálculo
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
                // invalid={!!form.formState.errors.name}
                // errorText={form.formState.errors.name?.message}
                // required
              >
                <Input
                // register={form.register('name', {
                //   required: 'O nome é obrigatório',
                // })}
                />
              </Field>
              <Button>Calcular</Button>
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
                // invalid={!!form.formState.errors.name}
                // errorText={form.formState.errors.name?.message}
                // required
              >
                <Input
                // register={form.register('name', {
                //   required: 'O nome é obrigatório',
                // })}
                />
              </Field>
              <Field
                label="Em quantos meses?"
                // invalid={!!form.formState.errors.name}
                // errorText={form.formState.errors.name?.message}
                // required
              >
                <Input
                // register={form.register('name', {
                //   required: 'O nome é obrigatório',
                // })}
                />
              </Field>
              <Button>Calcular</Button>
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
                // invalid={!!form.formState.errors.name}
                // errorText={form.formState.errors.name?.message}
                // required
              >
                <Input
                // register={form.register('name', {
                //   required: 'O nome é obrigatório',
                // })}
                />
              </Field>
              <Field
                label="Qual seu gasto mensal?"
                // invalid={!!form.formState.errors.name}
                // errorText={form.formState.errors.name?.message}
                // required
              >
                <Input
                // register={form.register('name', {
                //   required: 'O nome é obrigatório',
                // })}
                />
              </Field>

              <Button>Calcular</Button>
            </VStack>
          )}
        </Center>
      </LayoutContainer>
    </div>
  )
}
