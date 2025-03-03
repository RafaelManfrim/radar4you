import { Flex } from '@chakra-ui/react'
import { Logo } from './Logo'
import { Menu } from './Menu'
import { Link } from 'react-router-dom'

export function Header() {
  return (
    <Flex
      as="header"
      w="full"
      justify="center"
      p="6"
      borderBottomWidth={1}
      borderBottomColor="brand.text"
    >
      <Flex justify="space-between" align="center" w="full" maxW={1280}>
        <Link to="/calculadora">
          <Logo maxW={['24', '32']} />
        </Link>
        <Menu />
      </Flex>
    </Flex>
  )
}
