import { Flex, Heading, Show, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { api } from '@/lib/axios'
import { Filters, FilterValue } from '@/components/Filters'

import { Cartao } from './admin/Cartoes'
import { Bandeira } from './admin/Bandeiras'
import { InstituicaoFinanceira } from './admin/InstituicoesFinanceiras'
import { CartaoCard } from '@/components/CartaoCard'
import { CheckedChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/checkbox/namespace'
import { Skeleton } from '@/components/ui/skeleton'
import { NoItemsMessageCard } from './NoItemsMessageCard'

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

  const filteredCards =
    cartoes
      ?.filter((card) =>
        cartoesUsuario?.every((userCard) => userCard.card_id !== card.id),
      )
      .filter((card) => {
        if (bandeirasFilter.some((value) => value.checked)) {
          const bandeiraFilter = bandeirasFilter.find(
            (filter) => filter.value === card.card_brand_id,
          )
          if (!bandeiraFilter?.checked) {
            return false
          }
        }

        if (instituicoesFinanceirasFilter.some((value) => value.checked)) {
          const instituicaoFilter = instituicoesFinanceirasFilter.find(
            (filter) => filter.value === card.financial_institution_id,
          )
          if (!instituicaoFilter?.checked) {
            return false
          }
        }

        return true
      }) ?? []

  const isLoading =
    !cartoes || !cartoesUsuario || !bandeiras || !instituicoesFinanceiras

  function handleRootBandeirasClick(e: CheckedChangeDetails) {
    setBandeirasFilter((current) =>
      current.map((value) => ({ ...value, checked: !!e.checked })),
    )
  }

  function handleItemBandeiraClick(e: CheckedChangeDetails, index: number) {
    setBandeirasFilter((current) => {
      const newValues = [...current]
      newValues[index] = { ...newValues[index], checked: !!e.checked }
      return newValues
    })
  }

  function handleRootInstituicoesFinanceirasClick(e: CheckedChangeDetails) {
    setInstituicoesFinanceirasFilter((current) =>
      current.map((value) => ({ ...value, checked: !!e.checked })),
    )
  }

  function handleItemInstituicaoFinanceiraClick(
    e: CheckedChangeDetails,
    index: number,
  ) {
    setInstituicoesFinanceirasFilter((current) => {
      const newValues = [...current]
      newValues[index] = { ...newValues[index], checked: !!e.checked }
      return newValues
    })
  }

  async function handleSetUserCard(cardId: string) {
    try {
      const response = await api.post('users/cards', {
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
      await api.delete(`users/cards/${userCardId}`)

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
        const response = await api.get('users/cards')
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
    <Flex w="full" justify="center" p="6">
      <Flex justify="start" align="start" gap="4" w="full" maxW={1280}>
        <VStack
          align="start"
          p="4"
          borderWidth={1}
          borderColor="brand.text"
          borderRadius="md"
          gap="4"
        >
          <Heading color="brand.title">Filtros</Heading>
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

        <VStack align="start" justify="start" w="full">
          <VStack
            w="full"
            p="4"
            borderWidth={1}
            borderColor="brand.text"
            borderRadius="md"
            gap="2"
          >
            <Heading color="brand.title">Meus Cartões</Heading>
            <Show
              when={!isLoading}
              children={cartoesUsuario?.map((cartao) => (
                <CartaoCard
                  key={cartao.id}
                  userCards={cartoesUsuario}
                  card={
                    cartoes?.find(
                      (card) => card.id === cartao.card_id,
                    ) as Cartao
                  }
                  onAddToMyCards={handleSetUserCard}
                  onRemoveFromMyCards={handleRemoveUserCard}
                />
              ))}
              fallback={Array.from({ length: 3 }, (_, i) => i).map(
                (_, index) => (
                  <Skeleton
                    key={index}
                    className="dark"
                    variant="shine"
                    height="16"
                    w="full"
                  />
                ),
              )}
            />
          </VStack>
          <VStack
            w="full"
            p="4"
            borderWidth={1}
            borderColor="brand.text"
            borderRadius="md"
            gap="2"
          >
            <Heading color="brand.title">Cartões</Heading>
            <Show
              when={!isLoading}
              children={filteredCards.map((cartao) => (
                <CartaoCard
                  key={cartao.id}
                  userCards={cartoesUsuario ?? []}
                  card={cartao}
                  onAddToMyCards={handleSetUserCard}
                  onRemoveFromMyCards={handleRemoveUserCard}
                />
              ))}
              fallback={Array.from({ length: 10 }, (_, i) => i).map(
                (_, index) => (
                  <Skeleton
                    key={index}
                    className="dark"
                    variant="shine"
                    height="16"
                    w="full"
                  />
                ),
              )}
            />
            {filteredCards.length === 0 && (
              <NoItemsMessageCard message="Nenhum cartão encontrado com os filtros selecionados" />
            )}
          </VStack>
        </VStack>
      </Flex>
    </Flex>
  )
}
