import { ReactNode } from 'react'
import { useCan } from '@/hooks/useCan'
import { Skeleton } from '@chakra-ui/react'
import { useAuth } from '@contexts/AuthContext'

interface CanProps {
  children: ReactNode
}

export function Can({ children }: CanProps) {
  const { isAuthenticated } = useAuth()
  const userCanSeeComponent = useCan()

  if (!isAuthenticated) {
    return (
      <>
        {Array(25)
          .fill(0)
          .map((_, index) => (
            <Skeleton key={index} height="10" width="full" mb="2" />
          ))}
      </>
    )
  } else if (!userCanSeeComponent) {
    return null
  }

  return <>{children}</>
}
