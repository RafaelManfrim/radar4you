import { Link } from 'react-router-dom'
import { Flex, HStack } from '@chakra-ui/react'

import { Logo } from '@/components/Logo'

import { Button } from '@/components/ui/button'

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
              <Button size={['xs', 'md']}>Registre-se</Button>
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
