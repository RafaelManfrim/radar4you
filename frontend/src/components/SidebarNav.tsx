import { Skeleton, Stack } from '@chakra-ui/react'
import { HiHome } from 'react-icons/hi'
import { FaBuilding, FaCreditCard, FaFlag } from 'react-icons/fa'

import { useAuth } from '@contexts/AuthContext'
import { NavSection } from './NavSection'

interface SidebarNavProps {
  iconsOnly: boolean
}

export function SidebarNav({ iconsOnly }: SidebarNavProps) {
  const { isAuthenticated } = useAuth()

  return (
    <Stack gap="6" align={['center', 'center', 'flex-start']}>
      {isAuthenticated ? (
        <>
          <NavSection
            to="/admin"
            title="Início"
            icon={HiHome}
            isNavigateLink
            isDisabled={false}
            iconOnly={iconsOnly}
          />
          <NavSection
            to="/admin/bandeiras"
            title="Bandeiras"
            icon={FaFlag}
            isNavigateLink
            isDisabled={false}
            iconOnly={iconsOnly}
          />
          <NavSection
            to="/admin/instituicoes-financeiras"
            title="Inst. Financeiras"
            icon={FaBuilding}
            isNavigateLink
            isDisabled={false}
            iconOnly={iconsOnly}
          />
          <NavSection
            to="/admin/cartoes"
            title="Cartões"
            icon={FaCreditCard}
            isNavigateLink
            isDisabled={false}
            iconOnly={iconsOnly}
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
