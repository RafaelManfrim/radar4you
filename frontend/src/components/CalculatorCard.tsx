import { Box, Flex, FlexProps, Image, Text } from '@chakra-ui/react'
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
      flex={1}
      borderWidth={1}
      borderColor="brand.text"
      rounded="md"
      align="center"
      justify="space-between"
      gap="2"
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
      {cartao.image_url ? (
        <Image
          minH={['30px', '40px', '40px', '30px', '40px']}
          minW={['48px', '64px', '64px', '48px', '64px']}
          maxH={['30px', '40px', '40px', '30px', '40px']}
          maxW={['48px', '64px', '64px', '48px', '64px']}
          src={cartao.image_url}
          alt={`Imagem do cartão ${cartao.title}`}
        />
      ) : (
        <Box
          minW={['48px', '64px', '64px', '48px', '64px']}
          minH={['30px', '40px', '40px', '30px', '40px']}
          maxW={['48px', '64px', '64px', '48px', '64px']}
          maxH={['30px', '40px', '40px', '30px', '40px']}
          bgColor="brand.text-transparent"
          borderRadius="sm"
        ></Box>
      )}
      <Text as="span" w="full" lineClamp={['1', '1', '2']}>
        {cartao.title}
      </Text>
    </Flex>
  )
}
