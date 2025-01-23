import fastify from 'fastify'
import cors from '@fastify/cors'
import { ZodError } from 'zod'

import { appRoutes } from './http/routes'
import { env } from './env'

const app = fastify()

app.register(cors)

app.register(appRoutes)

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
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({
    message: 'Internal server error',
  })
})

export { app }
