import { Text, LinkProps as ChakraLinkProps, Flex } from '@chakra-ui/react'

import { useLocation } from 'react-router-dom'

interface NavLinkComponentProps extends ChakraLinkProps {
  to: string
  title: string
}

export function NavLinkComponent({ to, title }: NavLinkComponentProps) {
  const { pathname } = useLocation()

  const isActive = pathname === to

  return (
    <Flex
      cursor="pointer"
      color={isActive ? 'purple.500' : 'gray.500'}
      userSelect="none"
      transition="all 0.2s"
    >
      <Text fontWeight="medium">{title}</Text>
    </Flex>
  )
}
