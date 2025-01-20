import { Text, LinkProps as ChakraLinkProps, Box, Flex } from '@chakra-ui/react'

import { cloneElement, ReactElement } from 'react'
import { NavLink, NavLinkProps, useLocation } from 'react-router-dom'

interface NavLinkComponentProps extends ChakraLinkProps {
  to: string
  title: string
}

interface ActiveLinkProps extends NavLinkProps {
  children: ReactElement
}

export function ActiveLink({ children, ...rest }: ActiveLinkProps) {
  const { pathname } = useLocation()

  const isActive = pathname === rest.to

  return (
    <NavLink {...rest}>
      {cloneElement(children, {
        color: isActive ? 'purple.500' : 'gray.500',
      })}
    </NavLink>
  )
}

export function NavLinkComponent({ to, title }: NavLinkComponentProps) {
  return (
    <Box>
      <ActiveLink to={to}>
        <Flex cursor="pointer" userSelect="none" transition="all 0.2s">
          <Text fontWeight="medium">{title}</Text>
        </Flex>
      </ActiveLink>
    </Box>
  )
}
