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
import { FaPlus } from 'react-icons/fa'
import { OpenChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/popover/namespace'

interface AddWithConfirmationPopoverButtonProps {
  open: boolean
  onOpenChange: (e: OpenChangeDetails) => void
  buttonAriaLabel: string
  popoverContent: React.ReactNode
  onAdd: () => void
}

export function AddWithConfirmationPopoverButton({
  open,
  onOpenChange,
  buttonAriaLabel,
  popoverContent,
  onAdd,
}: AddWithConfirmationPopoverButtonProps) {
  return (
    <PopoverRoot open={open} onOpenChange={(e) => onOpenChange(e)}>
      <PopoverTrigger asChild>
        <IconButton
          aria-label={buttonAriaLabel}
          size="2xs"
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
          _icon={{
            width: '3',
            height: '3',
          }}
        >
          <FaPlus />
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
              bgColor="brand.primary"
              color="brand.title"
              borderWidth={0}
              ring="none"
              _hover={{
                filter: 'brightness(0.9)',
                transition: 'filter 0.2s ease',
              }}
              onClick={onAdd}
            >
              Adicionar
            </Button>
          </Group>
        </PopoverFooter>
      </PopoverContent>
    </PopoverRoot>
  )
}
