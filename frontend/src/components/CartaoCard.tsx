import { Flex, IconButton } from '@chakra-ui/react'

import { Cartao } from '@/pages/admin/Cartoes'
import { FaPlus, FaTrash } from 'react-icons/fa'
import { UserCard } from '@/pages/Cartoes'

interface CartaoCardProps {
  card: Cartao
  userCards: UserCard[]
  onAddToMyCards: (cardId: string) => void
  onRemoveFromMyCards: (userCardId: string) => void
}

export function CartaoCard({
  card,
  userCards,
  onAddToMyCards,
  onRemoveFromMyCards,
}: CartaoCardProps) {
  const userCard = userCards.find((userCard) => userCard.card_id === card.id)

  return (
    <Flex>
      <Flex>{card.title}</Flex>
      {userCard ? (
        <IconButton
          aria-label="Remover dos meus cartões"
          size="xs"
          variant="subtle"
          colorPalette="red"
          onClick={() => onRemoveFromMyCards(userCard.id)}
        >
          <FaTrash />
        </IconButton>
      ) : (
        <IconButton
          aria-label="Adicionar aos meus cartões"
          size="xs"
          variant="subtle"
          colorPalette="purple"
          onClick={() => onAddToMyCards(card.id)}
        >
          <FaPlus />
        </IconButton>
      )}
    </Flex>
  )
}
