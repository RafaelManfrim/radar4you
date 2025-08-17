import { AspectRatio, Flex, Image } from '@chakra-ui/react'
import AnuncieAquiImg from '@assets/anuncie-aqui.png'

interface AdProps {
  isFirst?: boolean
}

export function Ad({ isFirst = false }: AdProps) {
  return (
    <Flex
      h="52"
      align="start"
      justify="end"
      {...(!isFirst && {
        marginLeft: '4',
      })}
    >
      <AspectRatio ratio={16 / 9} w={!isFirst ? 'full' : 'calc(100% - 1rem)'}>
        <Image src={AnuncieAquiImg} alt="Anuncie aqui" objectFit="contain" />
      </AspectRatio>
    </Flex>
  )
}
