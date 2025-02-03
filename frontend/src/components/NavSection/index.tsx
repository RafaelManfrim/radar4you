import { Box, Flex, useDisclosure } from '@chakra-ui/react'
import { ElementType, ReactNode } from 'react'
import { ActiveSection } from './ActiveSection'

interface NavSectionProps {
  to: string
  title: string
  icon: ElementType
  isNavigateLink?: boolean
  children?: ReactNode
  isDisabled?: boolean
  iconOnly: boolean
}

export function NavSection({
  to,
  title,
  icon,
  isNavigateLink,
  children,
  isDisabled = true,
  iconOnly,
}: NavSectionProps) {
  const { open, onOpen, onClose } = useDisclosure()

  const IconProp = icon

  return (
    <Box w="100%">
      <ActiveSection
        to={to}
        isNavigateLink={isNavigateLink}
        shouldMatchExactHref={to === '/admin'}
      >
        <Flex
          justifyContent="space-between"
          align="center"
          onClick={
            !isDisabled && children ? (open ? onClose : onOpen) : undefined
          }
          cursor={isDisabled ? 'not-allowed' : 'pointer'}
          userSelect="none"
          _hover={isDisabled ? undefined : { color: 'purple.500' }}
          transition="all 0.2s"
          color={isDisabled ? 'base.label' : undefined}
        >
          <Flex gap="2" px="2" align="center" w="full">
            <IconProp size={20} />
            {!iconOnly && (
              <Box
                as="strong"
                fontWeight="bold"
                fontSize="small"
                textTransform="uppercase"
              >
                {title}
              </Box>
            )}
          </Flex>
        </Flex>
      </ActiveSection>
    </Box>
  )
}
