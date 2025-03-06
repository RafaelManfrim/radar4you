import { Box, BoxProps } from '@chakra-ui/react'
import { forwardRef, ReactNode } from 'react'

interface BaseCardProps extends BoxProps {
  children: ReactNode
  variant: 'primary' | 'secondary'
}

export const BaseCard = forwardRef<HTMLDivElement, BaseCardProps>(
  ({ children, variant, ...rest }: BaseCardProps, ref) => {
    return (
      <Box
        bg={
          variant === 'primary' ? 'brand.background' : 'brand.text-transparent'
        }
        {...(variant === 'secondary' && {
          borderRadius: 4,
        })}
        overflow="hidden"
        border={1}
        borderStyle="solid"
        borderColor="brand.text"
        display="flex"
        flexDirection="column"
        ref={ref}
        {...rest}
      >
        {children}
      </Box>
    )
  },
)

BaseCard.displayName = 'BaseCard'
