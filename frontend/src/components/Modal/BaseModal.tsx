import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps as ChakraModalProps,
} from '@chakra-ui/react'

// import { Button, ButtonProps } from '@components/Button'

export interface ModalFooterButton extends ButtonProps {
  text: string
}

export interface ModalProps {
  headerText: string
  hasOverlay?: boolean
  hasHeaderCloseButton?: boolean
  isDisabledHeaderCloseButton?: boolean
  hasFooterCloseButton?: boolean
  isDisabledFooterCloseButton?: boolean
  closeButtonText?: string
  footerButtons?: ModalFooterButton[]
}

interface BaseModalProps extends ModalProps, ChakraModalProps {}

export function BaseModal({
  headerText,
  hasOverlay = true,
  hasHeaderCloseButton = true,
  isDisabledHeaderCloseButton = false,
  hasFooterCloseButton = true,
  isDisabledFooterCloseButton = false,
  closeButtonText = 'Cancelar',
  footerButtons,
  children,
  isOpen,
  onClose,
  size = '3xl',
  ...rest
}: BaseModalProps) {
  return (
    <Modal {...rest} isOpen={isOpen} onClose={onClose} size={size}>
      {hasOverlay && <ModalOverlay />}
      <ModalContent bgColor="base.card">
        <ModalHeader>{headerText}</ModalHeader>

        {hasHeaderCloseButton && (
          <ModalCloseButton disabled={isDisabledHeaderCloseButton} />
        )}

        <ModalBody pb={6}>{children}</ModalBody>

        <ModalFooter>
          <Flex justifyContent="space-between" flex={1} gap={3}>
            {hasFooterCloseButton && (
              <Button
                onClick={onClose}
                isDisabled={isDisabledFooterCloseButton}
                colorExtendedScheme="gray"
              >
                {closeButtonText}
              </Button>
            )}

            <Flex gap={3}>
              {footerButtons?.map((footerButton, index) => (
                <Button key={index} {...footerButton}>
                  {footerButton.text}
                </Button>
              ))}
            </Flex>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
