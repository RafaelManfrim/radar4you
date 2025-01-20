import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from './routes/routes'

import { AuthContextProvider } from '@contexts/AuthContext'
import { Provider } from '@components/ui/provider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <AuthContextProvider>
        <RouterProvider router={router} />
      </AuthContextProvider>
    </Provider>
  </StrictMode>,
)
