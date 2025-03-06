import { Center, Heading, Icon, Text } from '@chakra-ui/react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdBlock } from 'react-icons/md'

export function AcessoNegado() {
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      navigate('/')
    }, 3000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Center h="100vh" flexDir="column">
      <Icon fontSize="8xl" color="red.700">
        <MdBlock />
      </Icon>
      <Heading as="strong" color="brand.primary" fontSize="5xl">
        Acesso Negado!
      </Heading>
      <Text as="p" fontSize="2xl" color="brand.primary">
        Redirecionando para a página inicial
      </Text>
    </Center>
  )
}
