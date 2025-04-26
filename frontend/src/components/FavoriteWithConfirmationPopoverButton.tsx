import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverRoot,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from './ui/button'
import { Group, IconButton } from '@chakra-ui/react'
import { FaStar } from 'react-icons/fa'
import { OpenChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/popover/namespace'

interface AddWithConfirmationPopoverButtonProps {
  favoriteStatus: boolean
  open: boolean
  onOpenChange: (e: OpenChangeDetails) => void
  buttonAriaLabel: string
  popoverContent: React.ReactNode
  onFavorite: () => void
}

export function FavoriteWithConfirmationPopoverButton({
  favoriteStatus,
  open,
  onOpenChange,
  buttonAriaLabel,
  popoverContent,
  onFavorite,
}: AddWithConfirmationPopoverButtonProps) {
  return (
    <PopoverRoot open={open} onOpenChange={(e) => onOpenChange(e)}>
      <PopoverTrigger asChild>
        <IconButton
          aria-label={buttonAriaLabel}
          size="2xs"
          className="dark"
          variant="surface"
          bgColor={favoriteStatus ? 'yellow.600' : 'brand.text'}
          color="brand.title"
          borderWidth={0}
          ring="none"
          _hover={{
            filter: 'brightness(0.9)',
            transition: 'filter 0.2s ease',
          }}
        >
          <FaStar />
        </IconButton>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>{popoverContent}</PopoverBody>
        <PopoverFooter>
          <Group align="center" justify="center" w="full">
            <Button
              size="sm"
              className="dark"
              variant="surface"
              bgColor="brand.text-transparent"
              color="brand.title"
              borderWidth={0}
              ring="none"
              _hover={{
                filter: 'brightness(0.9)',
                transition: 'filter 0.2s ease',
              }}
              onClick={() => onOpenChange({ open: false })}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              className="dark"
              variant="surface"
              bgColor={favoriteStatus ? 'brand.danger' : 'yellow.600'}
              color="brand.title"
              borderWidth={0}
              ring="none"
              _hover={{
                filter: 'brightness(0.9)',
                transition: 'filter 0.2s ease',
              }}
              onClick={onFavorite}
            >
              {favoriteStatus ? 'Desfavoritar' : 'Favoritar'}
            </Button>
          </Group>
        </PopoverFooter>
      </PopoverContent>
    </PopoverRoot>
  )
}
