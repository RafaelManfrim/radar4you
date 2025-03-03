import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import { AuthContextProvider } from '@contexts/AuthContext'
import { Router } from './routes/Router'
import { SidebarProvider } from './contexts/SidebarContext'
import { Toaster } from './components/ui/toaster'

import { system } from './styles/theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <SidebarProvider>
        <BrowserRouter>
          <AuthContextProvider>
            <Router />
          </AuthContextProvider>
        </BrowserRouter>
      </SidebarProvider>
      <Toaster />
    </ChakraProvider>
  </StrictMode>,
)
