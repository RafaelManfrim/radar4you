import { Route, Routes } from 'react-router-dom'

import { App } from '@pages/App'
import { Login } from '@pages/Login'
import { Admin } from '@pages/Admin'
import { History } from '@pages/History'
import { Profile } from '@pages/Profile'
import { LandingPage } from '@pages/LandingPage'
import { Register } from '@/pages/Register'
import { ForgotMyPassword } from '@/pages/ForgotMyPassword'
import { NewPassword } from '@/pages/NewPassword'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { AcessoNegado } from '@/pages/AcessoNegado'

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/esqueci-minha-senha" element={<ForgotMyPassword />} />
      <Route path="/nova-senha" element={<NewPassword />} />
      <Route path="/acesso-negado" element={<AcessoNegado />} />
      <Route path="/calculadora" element={<AppLayout />}>
        <Route path="/calculadora/" element={<App />} />
        <Route path="/calculadora/historico" element={<History />} />
        <Route path="/calculadora/perfil" element={<Profile />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="/admin/" element={<Admin />} />
      </Route>
    </Routes>
  )
}
