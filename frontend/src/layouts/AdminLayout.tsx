import { Outlet, useNavigate } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext'
import { Can } from '@/components/Can'

export function AdminLayout() {
  const { authData } = useAuth()
  const navigate = useNavigate()

  const canAccess = authData?.user.role === 'ADMIN'

  if (!canAccess) {
    navigate('/calculadora')
  }

  return (
    <Can>
      <h1>Admin Layout - {authData?.user.first_name}</h1>
      <Outlet />
    </Can>
  )
}
