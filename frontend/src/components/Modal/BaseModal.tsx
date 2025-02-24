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
      // onClose={onClose}
      onEscapeKeyDown={onClose}
      onInteractOutside={onClose}
    >
      <DialogContent>
        {hasHeaderCloseButton && (
          <DialogCloseTrigger
            onClick={onClose}
            disabled={isDisabledHeaderCloseButton}
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
                variant="outline"
                onClick={onClose}
                disabled={isDisabledFooterCloseButton}
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
