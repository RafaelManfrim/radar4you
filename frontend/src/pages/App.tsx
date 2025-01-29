import { Text, HStack, Center } from '@chakra-ui/react'
import { LuTable } from 'react-icons/lu'

import { useState } from 'react'
// import {
//   RadioCardItem,
//   RadioCardLabel,
//   RadioCardRoot,
// } from '@components/ui/radio-card'
import { LayoutContainer } from '@/components/LayoutContainer'
import { SegmentedControl } from '@/components/ui/segmented-control'
const tipos = [
  { value: 1, label: 'Pontos' },
  { value: 2, label: 'Gestão de Pontos' },
  { value: 3, label: 'Simulador' },
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

        <Center>
          <SegmentedControl
            size={['xs', 'xs', 'sm', 'md']}
            mb="6"
            defaultValue="1"
            onValueChange={(e) => setTipo(Number(e.value))}
            items={tipos.map((tipo) => {
              return {
                value: String(tipo.value),
                label: (
                  <HStack>
                    <LuTable />
                    {tipo.label}
                  </HStack>
                ),
              }
            })}
          />
        </Center>

        <Text as="h2" textAlign="center">
          {tipos.find((t) => t.value === tipo)?.label}
        </Text>

        {/* {tipo === 1 && (
          <Flex>
            <Text>Calculadora de Pontos</Text>
          </Flex>
        )}

        {tipo === 2 && (
          <Flex>
            <Text>Calculadora Gestão de Pontos</Text>
          </Flex>
        )}

        {tipo === 3 && (
          <Flex>
            <Text>Calculadora Simulador</Text>
          </Flex>
        )} */}
      </LayoutContainer>
    </div>
  )
}
