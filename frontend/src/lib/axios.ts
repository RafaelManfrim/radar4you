import { env } from '@/env'
import axios from 'axios'

export const api = axios.create({
  baseURL: env.VITE_BASE_URL,
})
