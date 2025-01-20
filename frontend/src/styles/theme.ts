import { createSystem, defaultBaseConfig, defineConfig } from '@chakra-ui/react'

const customConfig = defineConfig({})

export const system = createSystem(defaultBaseConfig, customConfig)
