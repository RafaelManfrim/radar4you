import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import { AuthContextProvider } from '@contexts/AuthContext'
import { Provider } from '@components/ui/provider'
import { Router } from './routes/Router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <BrowserRouter>
        <AuthContextProvider>
          <Router />
        </AuthContextProvider>
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
