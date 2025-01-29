import { Flex, HStack } from '@chakra-ui/react'
import { Logo } from './Logo'
import { NavLinkComponent } from './NavLink'
import { Button } from './ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Can } from './Can'

export function Header() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <Flex as="header" w="full" bg="gray.200" justify="center" p="6">
      <Flex justify="space-between" align="center" w="full" maxW={1280}>
        <Logo />

        <Flex
          as="nav"
          color="white"
          justify="space-around"
          align="center"
          gap="4"
        >
          <NavLinkComponent title="Calculadora" to="/calculadora" />
          <NavLinkComponent title="Histórico" to="/calculadora/historico" />
          <NavLinkComponent title="Perfil" to="/calculadora/perfil" />
        </Flex>

        <HStack>
          <Can>
            <Button onClick={() => navigate('/admin')}>Admin</Button>
          </Can>
          <Button onClick={signOut}>Sair</Button>
        </HStack>
      </Flex>
    </Flex>
  )
}
