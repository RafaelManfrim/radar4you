import { createBrowserRouter } from 'react-router-dom'

import { App } from '@pages/App'
import { Login } from '@pages/Login'
import { Admin } from '@pages/Admin'
import { History } from '@pages/History'
import { Profile } from '@pages/Profile'
import { LandingPage } from '@pages/LandingPage'
import { Register } from '@/pages/Register'
import { ForgotMyPassword } from '@/pages/ForgotMyPassword'
import { NewPassword } from '@/pages/NewPassword'

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
    path: '/registro',
    element: <Register />,
  },
  {
    path: '/esqueci-minha-senha',
    element: <ForgotMyPassword />,
  },
  {
    path: '/nova-senha',
    element: <NewPassword />,
  },
  {
    path: '/calculadora',
    element: <App />,
  },
  {
    path: '/calculadora/historico',
    element: <History />,
  },
  {
    path: '/calculadora/perfil',
    element: <Profile />,
  },
  {
    path: '/calculadora/admin',
    element: <Admin />,
  },
])
