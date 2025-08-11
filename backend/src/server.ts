import { app } from './app'
import { env } from './env'

app
  .listen({
    port: env.PORT,
    host: env.NODE_ENV === 'production' ? '0.0.0.0' : '192.168.0.108',
  })
  .then(() => {
    console.log('HTTP Server is running on http://localhost:' + env.PORT)
  })
