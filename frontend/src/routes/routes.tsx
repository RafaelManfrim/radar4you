import { createBrowserRouter } from 'react-router-dom'

import { App } from '@pages/App'
import { Login } from '@pages/Login'
import { Admin } from '@pages/Admin'
import { History } from '@pages/History'
import { Profile } from '@pages/Profile'
import { LandingPage } from '@pages/LandingPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/calculadora',
    element: <App />,
  },
  {
    path: '/historico',
    element: <History />,
  },
  {
    path: '/perfil',
    element: <Profile />,
  },
  {
    path: '/admin',
    element: <Admin />,
  },
])
