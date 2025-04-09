// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

module.exports = {
  apps: [
    {
      name: 'radar4you-api',
      script: './build/server.js',
      env: {
        NODE_ENV: 'production',
        ...process.env,
      },
    },
  ],
}
