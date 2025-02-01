import {
  Box,
  // Drawer,
  // DrawerBody,
  // DrawerCloseButton,
  // DrawerContent,
  // DrawerHeader,
  // DrawerOverlay,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react'
// import { useLocation } from 'react-router-dom'

import { useSidebar } from '@contexts/SidebarContext'
// import { useSidebarDrawer } from '@contexts/SidebarDrawerContext'

// import { AdminSidebarNav } from './AdminSidebarNav'
// import { UserSidebarNav } from './UserSidebarNav'
// import { HeaderIcon } from '@components/HeaderIcon'
import { useEffect, useRef } from 'react'
import { SidebarNav } from './SidebarNav'
import { Logo } from './Logo'
import { Button } from './ui/button'

interface SidebarProps {
  isVisible: boolean
}

export function Sidebar({ isVisible }: SidebarProps) {
  // const { pathname } = useLocation()
  // const { isOpen, onClose } = useSidebarDrawer()
  const { setSidebarWidth } = useSidebar()
  const sidebarRef = useRef<HTMLDivElement>(null)

  const isDrawerSidebar = useBreakpointValue({
    base: true,
    md: false,
  })

  useEffect(() => {
    if (isDrawerSidebar || !isVisible) {
      setSidebarWidth(0)
      return
    }

    const w = sidebarRef.current?.clientWidth
    if (w) {
      setSidebarWidth(w)
    }
  }, [isDrawerSidebar, isVisible, sidebarRef.current?.clientWidth])

  return isDrawerSidebar ? (
    <div>Sidebar Only Icons</div>
  ) : (
    // <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
    //   <DrawerOverlay>
    //     <DrawerContent bg="base.card" py="4">
    //       <DrawerCloseButton mt="6" />
    //       <DrawerHeader pl="6">Navegação</DrawerHeader>
    //       <DrawerBody px="3">
    //         {pathname.startsWith('/admin') ? (
    //           <AdminSidebarNav />
    //         ) : (
    //           <UserSidebarNav />
    //         )}
    //       </DrawerBody>
    //     </DrawerContent>
    //   </DrawerOverlay>
    // </Drawer>
    <Box
      as="aside"
      minW="52"
      py="4"
      pl="3"
      pr="5"
      bgColor="gray.50"
      borderRightWidth={1}
      borderStyle="solid"
      // borderColor="base.border"
      display={isVisible ? 'initial' : 'none'}
      ref={sidebarRef}
    >
      <Logo />
      <Box my="6">
        <Box as="strong" fontSize="sm" fontWeight="bold" color="purple.500">
          Menu
        </Box>
      </Box>
      <SidebarNav />
      <Box my="6">
        <Box as="strong" fontSize="sm" fontWeight="bold" color="purple.500">
          Opções
        </Box>
      </Box>
      <Flex flexDir="column" gap="4">
        <Button>Voltar à Aplicação</Button>
        <Button>Sair</Button>
      </Flex>
    </Box>
  )
}
