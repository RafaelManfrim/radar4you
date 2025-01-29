import { Outlet } from 'react-router-dom'

import { useAuth } from '@/contexts/AuthContext'
import { Header } from '@/components/Header'

export function AppLayout() {
  const { authData } = useAuth()

  return (
    <div>
      <Header />
      <h1>App Layout - {authData?.user.first_name}</h1>
      <Outlet />
    </div>
  )
}
