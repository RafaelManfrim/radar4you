import { Flex, Heading, VStack } from '@chakra-ui/react'

export function Profile() {
  return (
    <Flex w="full" justify="center" p="6">
      <Flex justify="start" align="start" gap="4" w="full" maxW={1280}>
        <VStack align="start" justify="start" w="full">
          <VStack
            w="full"
            p="4"
            borderWidth={1}
            borderColor="brand.text"
            borderRadius="md"
            gap="2"
          >
            <Heading color="brand.title">Meu Perfil</Heading>
            {/* Tabs (Meus Cartões, Notificações, Alterar Senha) */}
          </VStack>
        </VStack>
      </Flex>
    </Flex>
  )
}
