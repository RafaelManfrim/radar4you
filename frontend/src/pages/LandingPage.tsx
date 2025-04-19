import { Link } from 'react-router-dom'
import { Box, Flex, Heading, HStack, Icon, Text } from '@chakra-ui/react'

import { Logo } from '@/components/Logo'

import { Button } from '@/components/ui/button'
import { FaMagnifyingGlass } from 'react-icons/fa6'
import { FaCheck, FaCreditCard } from 'react-icons/fa'

const funcionalidades = [
  {
    id: 1,
    title: 'Compare cartões de crédito',
    description:
      'Compare cartões de crédito de diferentes instituições financeiras e encontre o que melhor se adapta ao seu perfil.',
    icon: <FaMagnifyingGlass />,
  },
  {
    id: 2,
    title: 'Descubra taxas e benefícios',
    description:
      'Descubra as taxas e benefícios de cada cartão de crédito para fazer a melhor escolha.',
    icon: <FaCreditCard />,
  },
  {
    id: 3,
    title: 'Faça a melhor escolha',
    description:
      'Com nossa ferramenta, você pode fazer a melhor escolha para suas finanças e ter mais controle sobre seus gastos.',
    icon: <FaCheck />,
  },
]

export function LandingPage() {
  return (
    <Flex w="full" align="center" flexDir="column" gap="4">
      <Flex
        w="full"
        justify="center"
        p="6"
        borderBottomWidth={1}
        borderBottomColor="brand.text"
      >
        <Flex
          gap="4"
          align="center"
          justify="space-between"
          w="full"
          maxW={1280}
        >
          <Logo maxW={['24', '32']} />
          <HStack>
            <Link to="/login">
              <Button size={['xs', 'md']}>Entrar</Button>
            </Link>
            <Link to="/registro">
              <Button size={['xs', 'md']}>Crie sua conta</Button>
            </Link>
          </HStack>
        </Flex>
      </Flex>
      <Flex w="full" align="center" justify="center" maxW={1120} mt="12">
        <Flex flexDir="column" align="start" p="6" maxW="500px">
          <Heading
            color="brand.title"
            fontSize={['2xl', '5xl']}
            lineHeight="normal"
          >
            Encontre o melhor cartão de crédito para você
          </Heading>
          <Text mt="6" lineHeight="shorter">
            Descubra os cartões de crédito que mais se adequam ao seu perfil e
            faça a melhor escolha para suas finanças.
          </Text>
          <Link to="/registro">
            <Button mt="6" size={['xs', 'md']}>
              Começar
            </Button>
          </Link>
        </Flex>
        <Box w="full" h="300px" bgColor="brand.text-transparent"></Box>
      </Flex>
      <Flex w="full" align="center" justify="center" maxW={1280} mt="12">
        <Flex flexDir="column" align="center" p="6" w="full">
          <Heading
            color="brand.title"
            fontSize={['2xl', '4xl']}
            lineHeight="normal"
            textAlign="center"
            maxW="700px"
          >
            Descubra o que não te contaram sobre cartões de crédito
          </Heading>

          <Box w="full" h="400px" bgColor="brand.text-transparent" mt="6"></Box>
        </Flex>
      </Flex>
      <Flex w="full" align="center" justify="center" maxW={1280} mt="12">
        <Flex flexDir="column" align="center" p="6" w="full">
          <Heading
            color="brand.title"
            fontSize={['2xl', '4xl']}
            lineHeight="normal"
            textAlign="center"
            maxW="700px"
          >
            A ferramenta que vai te ajudar a fazer a melhor escolha
          </Heading>

          <Flex mt="6" gap="8" flexDir={['column', 'column', 'row']}>
            {funcionalidades.map((f) => {
              return (
                <Flex key={f.id}>
                  <Icon size="2xl" color="brand.primary">
                    {f.icon}
                  </Icon>

                  <Flex flexDir="column" gap="2" ml="4">
                    <Text fontSize="lg" color="brand.title">
                      {f.title}
                    </Text>
                    <Text color="brand.text">{f.description}</Text>
                  </Flex>
                </Flex>
              )
            })}
          </Flex>
        </Flex>
      </Flex>
      <Flex w="full" align="center" justify="center" maxW={1280} mt="12">
        <Flex
          flexDir="column"
          align="center"
          p="6"
          w="full"
          borderWidth={1}
          borderColor="brand.text"
          borderRadius="lg"
          // bgColor="brand.text-transparent"
        >
          <Heading
            color="brand.secondary"
            fontSize={['2xl', '4xl']}
            lineHeight="normal"
            textAlign="center"
            maxW="700px"
          >
            Pronto para começar?
          </Heading>

          <Text mt="6" lineHeight="shorter" color="brand.title">
            Clique no botão abaixo e comece a comparar cartões de crédito agora
            mesmo!
          </Text>
          <Link to="/registro">
            <Button mt="6" size={['xs', 'md']}>
              Começar
            </Button>
          </Link>
        </Flex>
      </Flex>
      <Flex w="full" align="center" justify="center" maxW={1280} mt="12">
        <Flex flexDir="column" align="center" p="6" w="full">
          <Heading
            color="brand.title"
            fontSize={['2xl', '4xl']}
            lineHeight="normal"
            textAlign="center"
            maxW="700px"
          >
            FAQ
          </Heading>
          <Flex flexDir="column" align="center" p="6" w="full">
            <Text mt="6" lineHeight="shorter">
              Aqui estão algumas perguntas frequentes sobre nossa ferramenta de
              comparação de cartões de crédito. Se você tiver mais perguntas,
              não hesite em entrar em contato conosco.
            </Text>
            <Flex mt="6" flexDir="column" gap="1">
              <Text fontSize="lg" color="brand.title">
                O que é a ferramenta de comparação de cartões de crédito?
              </Text>
              <Text color="brand.text">
                Nossa ferramenta de comparação de cartões de crédito permite que
                você compare diferentes cartões de crédito de várias
                instituições financeiras. Você pode ver as taxas, benefícios e
                outras informações importantes para ajudá-lo a tomar uma decisão
                informada.
              </Text>

              <Text fontSize="lg" color="brand.title" mt="2">
                Como posso usar a ferramenta?
              </Text>
              <Text color="brand.text">
                Para usar a ferramenta, basta se cadastrar e acessar a página de
                comparação. Você poderá selecionar os cartões que deseja
                comparar e ver as informações lado a lado.
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
