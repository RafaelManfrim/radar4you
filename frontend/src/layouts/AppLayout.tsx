import { Outlet } from 'react-router-dom'

import { Header } from '@/components/Header'
import { Box } from '@chakra-ui/react'

export function AppLayout() {
  return (
    <Box minH="100vh">
      <Header />
      <Outlet />
    </Box>
  )
}
