import { Image, ImageProps } from '@chakra-ui/react'
import LogoImg from '@assets/isologo-branco.png'

interface LogoProps extends ImageProps {}

export function Logo(props: LogoProps) {
  return <Image src={LogoImg} alt="Logo do Radar4you" maxW="48" {...props} />
}
