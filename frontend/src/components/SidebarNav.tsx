import { Skeleton, Stack } from '@chakra-ui/react'
import { HiHome } from 'react-icons/hi'
import { FaCreditCard, FaFlag } from 'react-icons/fa'

import { useAuth } from '@contexts/AuthContext'
import { NavSection } from './NavSection'

export function SidebarNav() {
  const { isAuthenticated } = useAuth()

  return (
    <Stack gap="6" align="flex-start">
      {isAuthenticated ? (
        <>
          <NavSection
            to="/admin"
            title="Início"
            icon={HiHome}
            isNavigateLink
            isDisabled={false}
          />
          <NavSection
            to="/admin/bandeiras"
            title="Bandeiras"
            icon={FaFlag}
            isNavigateLink
            isDisabled={false}
          />
          <NavSection
            to="/admin/cartoes"
            title="Cartões"
            icon={FaCreditCard}
            isNavigateLink
            isDisabled={false}
          />
        </>
      ) : (
        Array(7)
          .fill(0)
          .map((_, index) => <Skeleton key={index} height="6" width="100%" />)
      )}
    </Stack>
  )
}
