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
import axios from 'axios'
import { toaster } from '@/components/ui/toaster'
import { LayoutContainer } from '@/components/LayoutContainer'

export interface UserCard {
  id: string
  user_id: string
  card_id: string
  is_favorite: boolean
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
    } catch (error) {
      console.log(error)

      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return toaster.create({
          title: 'Houve um erro',
          description: error.response.data.message,
        })
      }
    }
  }

  async function handleFavoriteCard(userCardId: string) {
    try {
      await api.patch(`users/cards/${userCardId}`)

      setCartoesUsuario((current) => {
        if (!current) {
          return []
        }

        return current.map((userCard) => {
          if (userCard.id === userCardId) {
            return { ...userCard, is_favorite: !userCard.is_favorite }
          }

          return userCard
        })
      })
    } catch (error) {
      console.log(error)

      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return toaster.create({
          title: 'Houve um erro',
          description: error.response.data.message,
        })
      }
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
    <LayoutContainer>
      <Flex
        justify="start"
        align="start"
        gap="4"
        w="full"
        maxW={1280}
        flexDir={['column', 'column', 'row']}
      >
        <VStack
          align="start"
          p="4"
          borderWidth={1}
          borderColor="brand.text"
          borderRadius="md"
          gap="4"
          w="full"
          maxW={['none', 'none', '250px']}
        >
          <Heading color="brand.title" alignSelf="center" mb="1">
            Filtros
          </Heading>
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
            <Heading color="brand.title" mb="1">
              Meus Cartões
            </Heading>
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
                  onToggleFavorite={handleFavoriteCard}
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
            {cartoesUsuario?.length === 0 && (
              <NoItemsMessageCard message="Você ainda não possui cartões selecionados" />
            )}
          </VStack>
          <VStack
            w="full"
            p="4"
            borderWidth={1}
            borderColor="brand.text"
            borderRadius="md"
            gap="2"
          >
            <Heading color="brand.title" mb="1">
              Mais Cartões
            </Heading>
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
    </LayoutContainer>
  )
}
