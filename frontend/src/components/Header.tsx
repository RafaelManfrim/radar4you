import { Flex } from '@chakra-ui/react'
import { Logo } from './Logo'
import { NavLinkComponent } from './NavLink'

export function Header() {
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
          <NavLinkComponent title="Histórico" to="/historico" />
          <NavLinkComponent title="Perfil" to="/perfil" />
        </Flex>

        <div>Ações</div>
      </Flex>
    </Flex>
  )
}
