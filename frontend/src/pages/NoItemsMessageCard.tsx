import { Flex, Icon, Text } from '@chakra-ui/react'
import { BiError } from 'react-icons/bi'

interface NoItemsMessageCardProps {
  message: string
}

export function NoItemsMessageCard({ message }: NoItemsMessageCardProps) {
  return (
    <Flex
      gap="4"
      align="center"
      justify="center"
      bgColor="brand.text-transparent"
      p="2"
      borderRadius="sm"
      w="full"
    >
      <Icon fontSize="4xl" color="brand.secondary">
        <BiError />
      </Icon>
      <Text color="brand.title">{message}</Text>
    </Flex>
  )
}
