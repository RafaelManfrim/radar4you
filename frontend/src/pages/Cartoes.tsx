import { Flex, HStack, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { api } from '@/lib/axios'
import { Filters, FilterValue } from '@/components/Filters'

import { Cartao } from './admin/Cartoes'
import { Bandeira } from './admin/Bandeiras'
import { InstituicaoFinanceira } from './admin/InstituicoesFinanceiras'
import { CartaoCard } from '@/components/CartaoCard'

export interface UserCard {
  id: string
  user_id: string
  card_id: string
  created_at: number
  updated_at: number
}

export function Cartoes() {
  const [cartoes, setCartoes] = useState<Cartao[]>()
  const [cartoesUsuario, setCartoesUsuario] = useState<UserCard[]>()

  const [bandeiras, setBandeiras] = useState<Bandeira[]>()
  const [instituicoesFinanceiras, setInstituicoesFinanceiras] =
    useState<InstituicaoFinanceira[]>()

  const [bandeirasFilter, setBandeirasFilter] = useState<FilterValue[]>([])
  const [instituicoesFinanceirasFilter, setInstituicoesFinanceirasFilter] =
    useState<FilterValue[]>([])

  const isLoading =
    !cartoes || !cartoesUsuario || !bandeiras || !instituicoesFinanceiras

  function handleRootBandeirasClick(e) {
    setBandeirasFilter((current) =>
      current.map((value) => ({ ...value, checked: !!e.checked })),
    )
  }

  function handleItemBandeiraClick(e, index: number) {
    setInstituicoesFinanceirasFilter((current) => {
      const newValues = [...current]
      newValues[index] = { ...newValues[index], checked: !!e.checked }
      return newValues
    })
  }

  function handleRootInstituicoesFinanceirasClick(e) {
    setInstituicoesFinanceirasFilter((current) =>
      current.map((value) => ({ ...value, checked: !!e.checked })),
    )
  }

  function handleItemInstituicaoFinanceiraClick(e, index: number) {
    setInstituicoesFinanceirasFilter((current) => {
      const newValues = [...current]
      newValues[index] = { ...newValues[index], checked: !!e.checked }
      return newValues
    })
  }

  async function handleSetUserCard(cardId: string) {
    try {
      const response = await api.post('user/cards', {
        card_id: cardId,
      })

      const card = response.data.userCard

      setCartoesUsuario((current) => {
        if (!current) {
          return [card]
        }

        return [...current, card]
      })
    } catch (err) {
      console.log(err)
    }
  }

  async function handleRemoveUserCard(userCardId: string) {
    try {
      await api.delete(`user/cards/${userCardId}`)

      setCartoesUsuario((current) => {
        if (!current) {
          return []
        }

        return current.filter((userCard) => userCard.id !== userCardId)
      })
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    async function fetchCartoes() {
      try {
        const response = await api.get('cards')
        setCartoes(response.data.cards)
      } catch (err) {
        console.log(err)
      }
    }

    async function fetchBandeiras() {
      try {
        const response = await api.get('card-brands')

        const cardBrands: Bandeira[] = response.data.cardBrands

        setBandeiras(cardBrands)
        setBandeirasFilter(
          cardBrands.map((bandeira) => ({
            label: bandeira.name,
            checked: false,
            value: bandeira.id,
          })),
        )
      } catch (err) {
        console.log(err)
      }
    }

    async function fetchInstituicoesFinanceiras() {
      try {
        const response = await api.get('financial-institutions')
        const financialInstitutions: InstituicaoFinanceira[] =
          response.data.financialInstitutions

        setInstituicoesFinanceiras(financialInstitutions)
        setInstituicoesFinanceirasFilter(
          financialInstitutions.map((instituicao) => ({
            label: instituicao.name,
            checked: false,
            value: instituicao.id,
          })),
        )
      } catch (err) {
        console.log(err)
      }
    }

    async function fetchCartoesUsuario() {
      try {
        const response = await api.get('user/cards')
        const userCards = response.data.userCards
        setCartoesUsuario(userCards)
      } catch (err) {
        console.log(err)
      }
    }

    fetchCartoes()
    fetchCartoesUsuario()
    fetchBandeiras()
    fetchInstituicoesFinanceiras()
  }, [])

  return (
    <Flex gap="4" align="center" justify="center" mt="4">
      <VStack align="start" gap="8" bgColor="purple.50" p="4" borderRadius="md">
        <Filters
          title="Bandeiras"
          values={bandeirasFilter}
          onRootClick={handleRootBandeirasClick}
          onItemClick={handleItemBandeiraClick}
        />
        <Filters
          title="Instituições Financeiras"
          values={instituicoesFinanceirasFilter}
          onRootClick={handleRootInstituicoesFinanceirasClick}
          onItemClick={handleItemInstituicaoFinanceiraClick}
        />
      </VStack>
      <VStack align="start" gap="4">
        {isLoading ? (
          <Flex>Carregando...</Flex>
        ) : (
          <HStack align="start" justify="start">
            <VStack>
              <Flex>Cartões</Flex>
              {cartoes
                ?.filter((card) =>
                  cartoesUsuario.every(
                    (userCard) => userCard.card_id !== card.id,
                  ),
                )
                .map((cartao) => (
                  <CartaoCard
                    key={cartao.id}
                    userCards={cartoesUsuario}
                    card={cartao}
                    onAddToMyCards={handleSetUserCard}
                    onRemoveFromMyCards={handleRemoveUserCard}
                  />
                ))}
            </VStack>
            <VStack>
              <Flex>Meus Cartões</Flex>
              {cartoesUsuario?.map((cartao) => (
                <CartaoCard
                  key={cartao.id}
                  userCards={cartoesUsuario}
                  card={
                    cartoes.find((card) => card.id === cartao.card_id) as Cartao
                  }
                  onAddToMyCards={handleSetUserCard}
                  onRemoveFromMyCards={handleRemoveUserCard}
                />
              ))}
            </VStack>
          </HStack>
        )}
      </VStack>
    </Flex>
  )
}
