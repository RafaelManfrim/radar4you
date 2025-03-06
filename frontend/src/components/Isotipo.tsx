import { Image, ImageProps } from '@chakra-ui/react'
import IsotipoImg from '@assets/isotipo.png'

interface IsotipoProps extends ImageProps {}

export function Isotipo(props: IsotipoProps) {
  return (
    <Image
      src={IsotipoImg}
      alt="Isotipo do Radar4you"
      w="full"
      maxW="48"
      {...props}
    />
  )
}
