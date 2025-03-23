import { Box, Flex } from '@chakra-ui/react'

interface LayoutContainerProps {
  children: React.ReactNode
}

export function LayoutContainer(props: LayoutContainerProps) {
  return (
    <Flex w="full" justify="center" p={['4', '6']}>
      <Box w="full" maxW={1280}>
        {props.children}
      </Box>
    </Flex>
  )
}
