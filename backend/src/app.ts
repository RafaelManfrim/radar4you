import fastify from 'fastify'
import cors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'

import { userRoutes } from './http/routes/userRoutes'
import { env } from './env'
import { cardRoutes } from './http/routes/cardRoutes'
import { cardBrandRoutes } from './http/routes/cardBrandRoutes'
import { financialInstitutionRoutes } from './http/routes/financialInstitutionRoutes'
import { simulationRoutes } from './http/routes/simulationRoutes'

const app = fastify()

app.register(cors)

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
