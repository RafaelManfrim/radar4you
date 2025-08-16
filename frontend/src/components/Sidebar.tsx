import { Center, Flex, Text, useBreakpointValue } from '@chakra-ui/react'

import { SidebarNav } from './SidebarNav'
import { Logo } from './Logo'
import { Button } from './ui/button'
import { FaComputer } from 'react-icons/fa6'
import { FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { Isotipo } from './Isotipo'

export function Sidebar() {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const isSidebarIconsOnly = useBreakpointValue({
    base: true,
    md: false,
  })

  function handleGoBackToApp() {
    navigate('/')
  }

  return (
    <Flex
      flexDir="column"
      gap="6"
      as="aside"
      minW={isSidebarIconsOnly ? '22' : '52'}
      py="4"
      px="3"
      bgColor="brand.text-transparent"
      borderRightColor="brand.text"
      borderRightWidth={1}
      borderStyle="solid"
    >
      <Center my="4">
        <Link to="/admin">
          <Logo maxW="32" hideBelow="md" />
          <Isotipo maxW="8" hideFrom="md" />
        </Link>
      </Center>
      <Text
        as="strong"
        fontSize="sm"
        fontWeight="bold"
        color="brand.secondary"
        textAlign={['center', 'center', 'left']}
      >
        Menu
      </Text>
      <SidebarNav iconsOnly={!!isSidebarIconsOnly} />
      <Text
        as="strong"
        fontSize="sm"
        fontWeight="bold"
        color="brand.secondary"
        textAlign={['center', 'center', 'left']}
      >
        Opções
      </Text>
      <Flex flexDir="column" gap="4">
        <Button onClick={handleGoBackToApp}>
          {isSidebarIconsOnly ? <FaComputer /> : 'Voltar à Aplicação'}
        </Button>
        <Button onClick={signOut}>
          {isSidebarIconsOnly ? <FaSignOutAlt /> : 'Sair'}
        </Button>
      </Flex>
    </Flex>
  )
}
