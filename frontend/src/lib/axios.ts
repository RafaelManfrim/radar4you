import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'

import { env } from '@/env'

export const api = axios.create({
  baseURL: env.VITE_BASE_URL,
})

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    if (error?.response?.status === 403) {
      Cookies.remove('the-brocks.access', { path: '/calculadora' })
      Cookies.remove('the-brocks.refresh', { path: '/calculadora' })

      window.location.href = '/login'
    }

    return Promise.reject(error)
  },
)
