import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@components': '/src/components',
      '@utils': '/src/utils',
      '@pages': '/src/pages',
      '@assets': '/src/assets',
      '@routes': '/src/routes',
      '@contexts': '/src/contexts',
      '@styles': '/src/styles',
    },
  },
})
