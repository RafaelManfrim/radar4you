import { Box, BoxProps, Flex, Heading } from '@chakra-ui/react'
import { ReactNode, useRef } from 'react'
import { BaseCard } from './BaseCard'

interface CardProps extends BoxProps {
  children: ReactNode
  headerTitle?: string | ReactNode
  headerTitleSize?: BoxProps['fontSize']
  extraHeader?: ReactNode
  variant?: 'primary' | 'secondary'
}

export function Card({
  children,
  headerTitle,
  headerTitleSize = 'lg',
  extraHeader,
  variant = 'primary',
  ...rest
}: CardProps) {
  const node = useRef(null)
  const showHeader = !!headerTitle || !!extraHeader

  return (
    <BaseCard variant={variant} ref={node} {...rest}>
      {showHeader && (
        <Flex
          justifyContent="space-between"
          py="2"
          px="4"
          gap="2"
          flexWrap="wrap"
          alignItems="center"
          minH={12}
          bg="brand.text-transparent"
          borderBottom={1}
          borderBottomColor="brand.text"
          borderStyle="solid"
        >
          <Heading
            as="h2"
            fontSize={headerTitleSize}
            fontWeight="bold"
            color="brand.title"
          >
            {headerTitle}
          </Heading>
          {/* <Skeleton isLoaded={!isLoading} flex={1}>
          </Skeleton> */}

          <Flex justifyContent="center" alignItems="center" gap="2">
            {extraHeader && <Box>{extraHeader}</Box>}
          </Flex>
          {/* <Skeleton isLoaded={!isLoading}>
          </Skeleton> */}
        </Flex>
      )}
      <Flex flexDir="column" flex={1} p="4">
        {children}
      </Flex>
    </BaseCard>
  )
}
