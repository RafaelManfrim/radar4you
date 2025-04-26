import { Flex, VStack, Text, HStack, Image, Box } from '@chakra-ui/react'
import { useState } from 'react'

import { Cartao } from '@/pages/admin/Cartoes'
import { UserCard } from '@/pages/Cartoes'

import { RemoveWithConfirmationPopoverButton } from './RemoveWithConfirmationPopoverButton'
import { AddWithConfirmationPopoverButton } from './AddWithConfirmationPopoverButton'
import { FavoriteWithConfirmationPopoverButton } from './FavoriteWithConfirmationPopoverButton'
import { getMoedaByCurrency } from '@/utils/getMoedaByCurrency'

interface CartaoCardProps {
  card: Cartao
  userCards: UserCard[]
  onAddToMyCards?: (cardId: string) => void
  onToggleFavorite?: (userCardId: string) => void
  onRemoveFromMyCards?: (userCardId: string) => void
  isProfileVisualization?: boolean
}

export function CartaoCard({
  card,
  userCards,
  onAddToMyCards,
  onToggleFavorite,
  onRemoveFromMyCards,
  isProfileVisualization = false,
}: CartaoCardProps) {
  const [addConfirmationOpen, setAddConfirmationOpen] = useState(false)
  const [favoriteConfirmationOpen, setFavoriteConfirmationOpen] =
    useState(false)
  const [removeConfirmationOpen, setRemoveConfirmationOpen] = useState(false)

  const userCard = userCards.find((userCard) => userCard.card_id === card.id)

  return (
    <VStack w="full" bgColor="brand.text-transparent" borderRadius="sm" p="2">
      <Flex
        align="center"
        justify="space-between"
        w="full"
        borderBottomWidth={1}
        borderColor="brand.background"
        pb="2"
      >
        <Flex gap={[0, 0, '1']} flexDir={['column', 'column', 'row']}>
          <Text color="brand.title">{card.title}</Text>
          <Text>
            ({card.points_conversion_rate} ponto
            {card.points_conversion_rate !== 1 && 's'} /{' '}
            {getMoedaByCurrency(card.points_currency).toLocaleLowerCase()})
          </Text>
        </Flex>
        {userCard ? (
          <HStack>
            {onRemoveFromMyCards && (
              <RemoveWithConfirmationPopoverButton
                open={removeConfirmationOpen}
                onOpenChange={(e) => setRemoveConfirmationOpen(e.open)}
                buttonAriaLabel="Remover dos meus cartões"
                onRemove={() => onRemoveFromMyCards(userCard.id)}
                popoverContent={
                  <Text color="brand.title" fontSize="sm" textAlign="center">
                    Tem certeza que deseja remover o cartão{' '}
                    <Text as="span" color="brand.secondary">
                      {card.title}
                    </Text>{' '}
                    dos seus cartões?
                  </Text>
                }
              />
            )}
            {onToggleFavorite && (
              <FavoriteWithConfirmationPopoverButton
                favoriteStatus={userCard.is_favorite}
                open={favoriteConfirmationOpen}
                onOpenChange={(e) => setFavoriteConfirmationOpen(e.open)}
                buttonAriaLabel={
                  userCard.is_favorite
                    ? 'Desfavoritar cartão'
                    : 'Favoritar cartão'
                }
                onFavorite={() => {
                  setFavoriteConfirmationOpen(false)
                  onToggleFavorite(userCard.id)
                }}
                popoverContent={
                  <Text color="brand.title" fontSize="sm" textAlign="center">
                    Tem certeza que deseja{' '}
                    {userCard.is_favorite ? 'desfavoritar' : 'favoritar'} o
                    cartão{' '}
                    <Text as="span" color="brand.secondary">
                      {card.title}
                    </Text>
                    ? Cartões favoritados são selecionados automaticamente para
                    simulações.
                  </Text>
                }
              />
            )}
          </HStack>
        ) : (
          onAddToMyCards && (
            <AddWithConfirmationPopoverButton
              open={addConfirmationOpen}
              onOpenChange={(e) => setAddConfirmationOpen(e.open)}
              buttonAriaLabel="Adicionar aos meus cartões"
              onAdd={() => onAddToMyCards(card.id)}
              popoverContent={
                <Text color="brand.title" fontSize="sm" textAlign="center">
                  Tem certeza que deseja adicionar o cartão{' '}
                  <Text as="span" color="brand.secondary">
                    {card.title}
                  </Text>{' '}
                  aos seus cartões?
                </Text>
              }
            />
          )
        )}
      </Flex>
      <Flex
        justify="space-between"
        w="full"
        gap="4"
        flexDir={['column', 'column', 'row']}
      >
        <Flex
          gap="2"
          w="full"
          flexDir={['column', 'column', 'row']}
          align={['center', 'center', 'flex-start']}
        >
          {card.image_url ? (
            <Image
              minH="80px"
              minW="128px"
              maxH="80px"
              maxW="128px"
              src={card.image_url}
              alt={`Imagem do cartão ${card.title}`}
            />
          ) : (
            <Box
              minW="128px"
              minH="80px"
              maxW="128px"
              maxH="80px"
              bgColor="brand.background"
              borderRadius="sm"
            ></Box>
          )}

          <Flex
            borderWidth={1}
            borderColor="brand.background"
            borderRadius="sm"
            p="2"
            w="full"
            flexDir="column"
            fontSize={['xs', 'xs', 'xs', 'sm']}
            {...(isProfileVisualization && { fontSize: 'sm', p: '1' })}
          >
            <Text color="brand.title">Benefícios</Text>
            {card.benefits ? card.benefits : 'Nenhum benefício informado.'}
          </Flex>
          <Flex
            borderWidth={1}
            borderColor="brand.background"
            borderRadius="sm"
            p="2"
            w="full"
            flexDir="column"
            fontSize={['xs', 'xs', 'xs', 'sm']}
            {...(isProfileVisualization && { fontSize: 'sm', p: '1' })}
          >
            <Text color="brand.title">Salas VIP</Text>
            {card.vip_lounges
              ? card.vip_lounges
              : 'Nenhuma sala VIP informada.'}
          </Flex>
        </Flex>
        <Text color="brand.text" fontSize="xs" textAlign="right">
          Anuidade:{' '}
          <Text as="span" color="brand.secondary">
            {card.annual_fee
              ? Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(card.annual_fee ?? 0)
              : 'Grátis'}
          </Text>
        </Text>
      </Flex>
    </VStack>
  )
}
