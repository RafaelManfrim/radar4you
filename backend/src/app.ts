import fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import fastifyMultipart from '@fastify/multipart'
import { ZodError } from 'zod'

import { userRoutes } from './http/routes/userRoutes'
import { env } from './env'
import { cardRoutes } from './http/routes/cardRoutes'
import { cardBrandRoutes } from './http/routes/cardBrandRoutes'
import { financialInstitutionRoutes } from './http/routes/financialInstitutionRoutes'
import { simulationRoutes } from './http/routes/simulationRoutes'

const app = fastify()

app.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = [
      'http://194.140.199.171',
      'http://194.140.199.171:80',
      'https://194.140.199.171',
      'https://194.140.199.171:443',
      'http://www.radar4you.com.br',
      'https://www.radar4you.com.br',
      'http://radar4you.com.br',
      'https://radar4you.com.br',

      // ambientes de desenvolvimento
      'http://localhost',
      'http://localhost:5173',
      'http://localhost:80',
      'http://127.0.0.1',
      'http://192.168.0.105:5173',
    ]

    // Em chamadas sem Origin (ex: curl/postman), pode permitir
    if (!origin) {
      cb(null, true)
      return
    }

    if (allowedOrigins.includes(origin)) {
      cb(null, true)
    } else {
      console.warn('🚫 Origin não permitida pelo CORS:', origin)
      cb(new Error('Not allowed by CORS'), false)
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '30m',
  },
})

app.register(fastifyCookie)

app.register(fastifyMultipart)

app.get('/health', (req, res) => res.send('ok'))

app.register(userRoutes)
app.register(cardBrandRoutes)
app.register(financialInstitutionRoutes)
app.register(cardRoutes)
app.register(simulationRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    reply.status(400).send({
      message: 'Corpo da requisição inválido',
      issues: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    console.log(error)
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({
    message: 'Internal server error',
  })
})

export { app }
