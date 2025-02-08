import { Flex } from '@chakra-ui/react'
import { Cartao } from './admin/Cartoes'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'

export function Cartoes() {
  const [cartoes, setCartoes] = useState<Cartao[]>()

  useEffect(() => {
    async function fetchCartoes() {
      try {
        const response = await api.get('cards')
        setCartoes(response.data.cards)
      } catch (err) {
        console.log(err)
      }
    }

    fetchCartoes()
  }, [])

  return (
    <Flex>
      Cartoes
      <Flex>Listagem</Flex>
      {cartoes?.map((cartao) => <Flex key={cartao.id}>{cartao.title}</Flex>)}
    </Flex>
  )
}
