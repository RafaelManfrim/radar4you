import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  VITE_BASE_URL: z.string().url(),
  VITE_APP_API_KEY: z.string(),
  VITE_APP_AUTH_DOMAIN: z.string(),
  VITE_APP_PROJECT_ID: z.string(),
  VITE_APP_STORAGE_BUCKET: z.string(),
  VITE_APP_MESSAGING_SENDER_ID: z.string(),
  VITE_APP_APP_ID: z.string(),
})

const { success, data, error } = envSchema.safeParse(import.meta.env)

if (!success) {
  const message = 'Variáveis de ambiente inválidas'
  console.error(message, error.format())
  throw new Error(message)
}

export const env = data
