import { useAuth } from '@/contexts/AuthContext'

export function useCan() {
  const { authData, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return false
  }

  if (authData?.user.role === 'ADMIN') {
    return true
  }

  return false
}
