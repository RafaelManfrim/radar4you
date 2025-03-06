import { tableAnatomy } from '@chakra-ui/react/anatomy'
import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineSlotRecipe,
} from '@chakra-ui/react'

const tableSlotRecipe = defineSlotRecipe({
  slots: tableAnatomy.keys(),
  base: {
    root: {
      fontVariantNumeric: 'lining-nums tabular-nums',
      borderCollapse: 'collapse',
      width: 'full',
      textAlign: 'start',
      verticalAlign: 'top',
    },
    row: {
      _selected: {
        bg: 'colorPalette.subtle',
      },
    },
    cell: {
      textAlign: 'start',
      alignItems: 'center',
      color: 'brand.title',
    },
    columnHeader: {
      fontWeight: 'bold',
      textAlign: 'start',
      color: 'brand.title',
    },
    caption: {
      fontWeight: 'medium',
      textStyle: 'xs',
    },
    footer: {
      fontWeight: 'medium',
    },
  },
  variants: {
    interactive: {
      true: {
        body: {
          '& tr': {
            _hover: {
              bg: 'colorPalette.subtle',
            },
          },
        },
      },
    },

    stickyHeader: {
      true: {
        header: {
          '& :where(tr)': {
            top: 'var(--table-sticky-offset, 0)',
            position: 'sticky',
            zIndex: 1,
          },
        },
      },
    },

    striped: {
      true: {
        row: {
          '&:nth-of-type(odd) td': {
            bg: 'bg.muted',
          },
        },
      },
    },
    showColumnBorder: {
      true: {
        columnHeader: {
          '&:not(:last-of-type)': {
            borderInlineEndWidth: '1px',
            borderColor: 'brand.text',
          },
        },
        cell: {
          '&:not(:last-of-type)': {
            borderInlineEndWidth: '1px',
            borderColor: 'brand.text',
          },
        },
      },
    },
    variant: {
      line: {
        columnHeader: {
          borderBottomWidth: '1px',
          borderColor: 'brand.text',
        },
        cell: {
          borderBottomWidth: '1px',
          borderColor: 'brand.text',
        },
        row: {
          bg: 'bg',
        },
      },

      outline: {
        root: {
          boxShadow: '0 0 0 1px {colors.border}',
          overflow: 'hidden',
        },
        columnHeader: {
          borderBottomWidth: '1px',
          borderColor: 'brand.text',
        },
        header: {
          bg: 'brand.text-transparent',
        },
        row: {
          '&:not(:last-of-type)': {
            borderBottomWidth: '1px',
            borderColor: 'brand.text',
          },
        },
        footer: {
          borderTopWidth: '1px',
        },
      },
    },
  },
})

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
    slotRecipes: {
      table: tableSlotRecipe,
    },
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
          danger: { value: '#ad1d27' },
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
          fg: { value: '{colors.brand.background}' },
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
