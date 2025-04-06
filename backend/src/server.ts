import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT,
    host: env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost',
  })
  .then(() => {
    console.log('HTTP Server is running on http://localhost:' + env.PORT)
  })
