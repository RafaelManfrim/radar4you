import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({
  globalCss: {
    body: {
      bg: 'brand.background',
      color: 'brand.text',
    },
    '::selection': {
      bg: 'brand.secondary',
      color: 'brand.background',
    },
  },
  theme: {
    tokens: {
      fonts: {
        body: { value: 'Inter, sans-serif' },
        heading: { value: 'Plus Jakarta Sans, sans-serif' },
        mono: { value: 'Menlo, monospace' },
      },
      sizes: {
        '100': { value: '25rem' },
        '104': { value: '26rem' },
        '108': { value: '27rem' },
        '112': { value: '28rem' },
      },
      colors: {
        brand: {
          primary: { value: '#333fa8' },
          secondary: { value: '#64ccd0' },
          background: { value: '#0d0d0e' },
          title: { value: '#ffffff' },
          text: { value: '#7e7d9a' },
          'text-transparent': { value: '#7e7d9a33' },
          danger: { value: '#F40B1C' },
          success: { value: '#00C851' },
          warning: { value: '#FFBB33' },
          info: { value: '#33B5E5' },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: '{colors.brand.secondary}' },
          contrast: { value: '{colors.brand.background}' },
          fg: { value: '{colors.brand.secondary}' },
          muted: { value: '{colors.brand.secondary}' },
          subtle: { value: '{colors.brand.secondary}' },
          emphasized: { value: '{colors.brand.secondary}' },
          focusRing: { value: '{colors.brand.secondary}' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, customConfig)
