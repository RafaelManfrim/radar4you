import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  globalCss: {
    body: {
      bg: 'brand.background',
      color: 'brand.text',
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          primary: { value: '#333fa8' },
          secondary: { value: '#64ccd0' },
          background: { value: '#0d0d0e' },
          title: { value: '#ffffff' },
          text: { value: '#7e7d9a' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
