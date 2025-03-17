import { Flex, HStack, Text } from '@chakra-ui/react'
import { useState } from 'react'

import { Cartao } from '@/pages/admin/Cartoes'
import { UserCard } from '@/pages/Cartoes'

import { RemoveWithConfirmationPopoverButton } from './RemoveWithConfirmationPopoverButton'
import { AddWithConfirmationPopoverButton } from './AddWithConfirmationPopoverButton'
import { FavoriteWithConfirmationPopoverButton } from './FavoriteWithConfirmationPopoverButton'

interface CartaoCardProps {
  card: Cartao
  userCards: UserCard[]
  onAddToMyCards?: (cardId: string) => void
  onToggleFavorite?: (userCardId: string) => void
  onRemoveFromMyCards?: (userCardId: string) => void
}

export function CartaoCard({
  card,
  userCards,
  onAddToMyCards,
  onToggleFavorite,
  onRemoveFromMyCards,
}: CartaoCardProps) {
  const [addConfirmationOpen, setAddConfirmationOpen] = useState(false)
  const [favoriteConfirmationOpen, setFavoriteConfirmationOpen] =
    useState(false)
  const [removeConfirmationOpen, setRemoveConfirmationOpen] = useState(false)

  const userCard = userCards.find((userCard) => userCard.card_id === card.id)

  return (
    <Flex
      bgColor="brand.text-transparent"
      align="center"
      justify="space-between"
      borderRadius="sm"
      p="2"
      w="full"
    >
      <Text color="brand.title">{card.title}</Text>
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
                  {userCard.is_favorite ? 'desfavoritar' : 'favoritar'} o cartão{' '}
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
  )
}
