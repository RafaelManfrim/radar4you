import { Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext'
import { Can } from '@/components/Can'
import { Flex } from '@chakra-ui/react'
import { Sidebar } from '@/components/Sidebar'
// import { useSidebar } from '@/contexts/SidebarContext'

export function AdminLayout() {
  const { authData } = useAuth()
  const navigate = useNavigate()

  // const { isExtendedVersion, toggleExtendedVersion } = useSidebar()
  // const isDrawerSidebar = useBreakpointValue({
  //   base: true,
  //   md: false,
  // })

  const canAccess = authData?.user.role === 'ADMIN'

  if (!canAccess) {
    navigate('/')
  }

  return (
    <Can>
      <Flex minH="100vh" direction="column">
        <Flex w="100%" flex={1} mx="auto">
          <Sidebar />
          {/* {!isExtendedVersion && (
            <Flex
              w="4"
              borderTopWidth={1}
              borderStyle="solid"
              // borderColor="base.border"
              onMouseEnter={() => {
                toggleExtendedVersion({})
              }}
            />
          )} */}
          <Flex
            flexDir="column"
            w="100%"
            p="4"
            // pl={isExtendedVersion ? '4' : 0}
            gap="4"
            overflowX="auto"
            // onMouseEnter={() => {
            //   if (!isDrawerSidebar && isExtendedVersion) {
            //     toggleExtendedVersion({})
            //   }
            // }}
          >
            <Outlet />
          </Flex>
        </Flex>
      </Flex>
    </Can>
  )
}
