import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { AuthContextProvider } from '@contexts/AuthContext'
import { Provider } from '@components/ui/provider'
import { Router } from './routes/Router'
import { SidebarProvider } from './contexts/SidebarContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <SidebarProvider>
        <BrowserRouter>
          <AuthContextProvider>
            <Router />
          </AuthContextProvider>
        </BrowserRouter>
      </SidebarProvider>
    </Provider>
  </StrictMode>,
)
