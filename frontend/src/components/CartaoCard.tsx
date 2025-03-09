import { Flex, Text } from '@chakra-ui/react'
import { useState } from 'react'

import { Cartao } from '@/pages/admin/Cartoes'
import { UserCard } from '@/pages/Cartoes'

import { RemoveWithConfirmationPopoverButton } from './RemoveWithConfirmationPopoverButton'
import { AddWithConfirmationPopoverButton } from './AddWithConfirmationPopoverButton'

interface CartaoCardProps {
  card: Cartao
  userCards: UserCard[]
  onAddToMyCards?: (cardId: string) => void
  onRemoveFromMyCards?: (userCardId: string) => void
}

export function CartaoCard({
  card,
  userCards,
  onAddToMyCards,
  onRemoveFromMyCards,
}: CartaoCardProps) {
  const [removeConfirmationOpen, setRemoveConfirmationOpen] = useState(false)
  const [addConfirmationOpen, setAddConfirmationOpen] = useState(false)

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
      {userCard && onRemoveFromMyCards ? (
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
