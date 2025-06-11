import { Flex } from '@chakra-ui/react'

interface AdProps {
  isFirst?: boolean
  index: number
}

export function Ad({ isFirst = false, index }: AdProps) {
  return (
    <Flex
      h="52"
      bgColor="brand.secondary"
      color="brand.background"
      align="center"
      justify="center"
      fontSize="2xl"
      fontWeight="bold"
      {...(!isFirst && {
        marginLeft: '4',
      })}
    >
      {index}
    </Flex>
  )
}
