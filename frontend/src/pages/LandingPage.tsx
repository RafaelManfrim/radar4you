import { Link } from 'react-router-dom'
import { Flex, HStack } from '@chakra-ui/react'

import { Logo } from '@/components/Logo'

import { Button } from '@/components/ui/button'

export function LandingPage() {
  return (
    <Flex w="full" align="center" flexDir="column" gap="4">
      <Flex w="full" bg="gray.200" justify="center" p="6">
        <Flex
          gap="4"
          align="center"
          justify="space-between"
          w="full"
          maxW={1280}
        >
          <Logo />
          <HStack>
            <Link to="/registro">
              <Button>Registre-se</Button>
            </Link>
            <Link to="/login">
              <Button>Entrar</Button>
            </Link>
          </HStack>
        </Flex>
      </Flex>
      <Flex w="full" align="center" justify="center" maxW={1280}>
        Landing Page
      </Flex>
    </Flex>
  )
}
