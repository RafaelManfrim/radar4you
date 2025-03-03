import { HStack, Separator, Text } from '@chakra-ui/react'

export function OrSeparator() {
  return (
    <HStack>
      <Separator flex="1" borderColor="brand.text" />
      <Text flexShrink="0" px="2" color="brand.secondary" fontSize="sm">
        Ou
      </Text>
      <Separator flex="1" borderColor="brand.text" />
    </HStack>
  )
}
