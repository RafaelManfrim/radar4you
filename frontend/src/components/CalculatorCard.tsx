import { Flex, FlexProps, Text } from '@chakra-ui/react'
import { Cartao } from '@/pages/admin/Cartoes'

interface CalculatorCardProps extends FlexProps {
  cartao: Cartao
  isSelected: boolean
}

export function CalculatorCard({
  cartao,
  isSelected,
  ...rest
}: CalculatorCardProps) {
  return (
    <Flex
      key={cartao.id}
      p="2"
      w="full"
      maxW={400}
      borderWidth={1}
      borderColor="brand.text"
      rounded="md"
      align="center"
      justify="space-between"
      mb="4"
      fontSize="sm"
      cursor="pointer"
      color="brand.title"
      userSelect="none"
      _hover={{
        filter: 'brightness(0.97)',
        transition: 'filter 0.2s',
      }}
      {...(isSelected && {
        borderColor: 'brand.secondary',
        color: 'brand.secondary',
      })}
      {...rest}
    >
      <Text>{cartao.title}</Text>
    </Flex>
  )
}
