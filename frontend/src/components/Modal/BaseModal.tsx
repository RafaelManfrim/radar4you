import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button, ButtonProps } from '../ui/button'
import { Dialog, Flex } from '@chakra-ui/react'

export interface ModalFooterButton extends ButtonProps {
  text: string
}

export interface ModalProps {
  headerText: string
  hasHeaderCloseButton?: boolean
  isDisabledHeaderCloseButton?: boolean
  hasFooterCloseButton?: boolean
  isDisabledFooterCloseButton?: boolean
  closeButtonText?: string
  footerButtons?: ModalFooterButton[]
}

interface BaseModalProps extends ModalProps, Dialog.RootProps {
  onClose: () => void
}

export function BaseModal({
  headerText,
  hasHeaderCloseButton = true,
  isDisabledHeaderCloseButton = false,
  hasFooterCloseButton = true,
  isDisabledFooterCloseButton = false,
  closeButtonText = 'Cancelar',
  footerButtons,
  children,
  open,
  onClose,
  size = 'xl',
  ...rest
}: BaseModalProps) {
  return (
    <DialogRoot
      {...rest}
      open={open}
      onEscapeKeyDown={onClose}
      onInteractOutside={onClose}
      size={size}
    >
      <DialogContent className="dark" color="brand.title">
        {hasHeaderCloseButton && (
          <DialogCloseTrigger
            onClick={onClose}
            disabled={isDisabledHeaderCloseButton}
            color="brand.text"
            _hover={{ bgColor: 'brand.text-transparent' }}
          />
        )}
        <DialogHeader>
          <DialogTitle>{headerText}</DialogTitle>
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
        <DialogFooter>
          {hasFooterCloseButton && (
            <DialogActionTrigger asChild>
              <Button
                onClick={onClose}
                disabled={isDisabledFooterCloseButton}
                bgColor="brand.text-transparent"
                color="brand.title"
              >
                {closeButtonText}
              </Button>
            </DialogActionTrigger>
          )}
          <Flex gap={3}>
            {footerButtons?.map((footerButton, index) => (
              <Button key={index} {...footerButton}>
                {footerButton.text}
              </Button>
            ))}
          </Flex>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
