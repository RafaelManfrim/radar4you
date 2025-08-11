import { Route, Routes } from 'react-router-dom'

import { App } from '@pages/App'
import { Login } from '@pages/Login'
import { History } from '@pages/History'
import { Profile } from '@pages/Profile'
import { Register } from '@/pages/Register'
import { ForgotMyPassword } from '@/pages/ForgotMyPassword'
import { NewPassword } from '@/pages/NewPassword'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AppLayout } from '@/layouts/AppLayout'
import { AcessoNegado } from '@/pages/AcessoNegado'

import { Admin } from '@pages/admin/Admin'
import { Cartoes as CartoesAdmin } from '@/pages/admin/Cartoes'
import { Bandeiras } from '@/pages/admin/Bandeiras'
import { InstituicoesFinanceiras } from '@/pages/admin/InstituicoesFinanceiras'
import { Cartoes } from '@/pages/Cartoes'

export function Router() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Register />} />
      <Route path="/esqueci-minha-senha" element={<ForgotMyPassword />} />
      <Route path="/nova-senha/:token" element={<NewPassword />} />
      <Route path="/acesso-negado" element={<AcessoNegado />} />
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<App />} />
        <Route path="/cartoes" element={<Cartoes />} />
        <Route path="/historico" element={<History />} />
        <Route path="/perfil" element={<Profile />} />
      </Route>
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/bandeiras" element={<Bandeiras />} />
        <Route
          path="/admin/instituicoes-financeiras"
          element={<InstituicoesFinanceiras />}
        />
        <Route path="/admin/cartoes" element={<CartoesAdmin />} />
      </Route>
    </Routes>
  )
}
