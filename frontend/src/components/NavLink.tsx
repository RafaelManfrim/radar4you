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
      userSelect="none"
      {...(isActive && { color: 'brand.secondary' })}
    >
      <Text fontWeight="medium">{title}</Text>
    </Flex>
  )
}
