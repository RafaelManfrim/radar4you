import { Box, Flex, useBreakpointValue } from '@chakra-ui/react'

import { useRef } from 'react'
import { SidebarNav } from './SidebarNav'
import { Logo } from './Logo'
import { Button } from './ui/button'
import { FaComputer } from 'react-icons/fa6'
import { FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export function Sidebar() {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const sidebarRef = useRef<HTMLDivElement>(null)

  const isSidebarIconsOnly = useBreakpointValue({
    base: true,
    md: false,
  })

  function handleGoBackToApp() {
    navigate('/calculadora')
  }

  return (
    <Box
      as="aside"
      minW={isSidebarIconsOnly ? '22' : '52'}
      py="4"
      px="3"
      bgColor="gray.50"
      borderRightWidth={1}
      borderStyle="solid"
      ref={sidebarRef}
    >
      <Logo />
      <Box my="6">
        <Box as="strong" fontSize="sm" fontWeight="bold" color="purple.500">
          Menu
        </Box>
      </Box>
      <SidebarNav iconsOnly={!!isSidebarIconsOnly} />
      <Box my="6">
        <Box as="strong" fontSize="sm" fontWeight="bold" color="purple.500">
          Opções
        </Box>
      </Box>
      <Flex flexDir="column" gap="4">
        <Button onClick={handleGoBackToApp}>
          {isSidebarIconsOnly ? <FaComputer /> : 'Voltar à Aplicação'}
        </Button>
        <Button onClick={signOut}>
          {isSidebarIconsOnly ? <FaSignOutAlt /> : 'Sair'}
        </Button>
      </Flex>
    </Box>
  )
}
