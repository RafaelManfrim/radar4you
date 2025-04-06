import { config } from 'dotenv'

import { z } from 'zod'

if (process.env.NODE_ENV === 'test') {
  config({ path: '.env.test' })
}
if (process.env.NODE_ENV === 'production') {
  config({ path: '.env.prod' })
} else {
  config()
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  DATABASE_CLIENT: z.enum(['sqlite', 'pg']),
  JWT_SECRET: z.string(),
  DATABASE_SECURE_PASSWORD: z.string(),
  // DB_USERNAME: z.string().optional(),
  // DB_PASSWORD: z.string().optional(),
  // DB_DATABASE: z.string().optional(),
})
// .refine((data) => {
//   if (data.DATABASE_CLIENT === 'sqlite') {
//     return (
//       data.DB_USERNAME === undefined &&
//       data.DB_PASSWORD === undefined &&
//       data.DB_DATABASE === undefined
//     )
//   }

//   return true
// })

const { success, data, error } = envSchema.safeParse(process.env)

if (!success) {
  const message = 'Variáveis de ambiente inválidas'
  console.error(message, error.format())
  throw new Error(message)
}

export const env = data
