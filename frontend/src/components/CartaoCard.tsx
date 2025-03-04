import { Flex, IconButton, Text } from '@chakra-ui/react'

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
        <IconButton
          aria-label="Remover dos meus cartões"
          size="xs"
          className="dark"
          variant="surface"
          bgColor="brand.danger"
          color="brand.title"
          borderWidth={0}
          ring="none"
          _hover={{
            filter: 'brightness(0.9)',
            transition: 'filter 0.2s ease',
          }}
          onClick={() => onRemoveFromMyCards(userCard.id)}
        >
          <FaTrash />
        </IconButton>
      ) : (
        <IconButton
          aria-label="Adicionar aos meus cartões"
          size="xs"
          className="dark"
          variant="surface"
          bgColor="brand.primary"
          color="brand.title"
          borderWidth={0}
          ring="none"
          _hover={{
            filter: 'brightness(0.9)',
            transition: 'filter 0.2s ease',
          }}
          onClick={() => onAddToMyCards(card.id)}
        >
          <FaPlus />
        </IconButton>
      )}
    </Flex>
  )
}
