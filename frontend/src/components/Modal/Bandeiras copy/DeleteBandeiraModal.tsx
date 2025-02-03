import { api } from '@/lib/axios'
import { BaseModal, ModalFooterButton } from '../BaseModal'
import { toaster } from '@/components/ui/toaster'
import { Dialog, UseDisclosureReturn } from '@chakra-ui/react'
import { Bandeira } from '@/pages/Bandeiras'

interface DeleteBandeiraModalProps
  extends Omit<Dialog.RootProps, 'isOpen' | 'onClose' | 'children'> {
  selectedBandeira: Bandeira
  onDelete: (bandeira: Bandeira) => void
  disclosure: UseDisclosureReturn
}

export function DeleteBandeiraModal({
  selectedBandeira,
  onDelete,
  disclosure,
  ...rest
}: DeleteBandeiraModalProps) {
  async function handleDeleteClick() {
    try {
      await api.delete(`/card-brands/${selectedBandeira.id}`)

      onDelete(selectedBandeira)

      disclosure.onClose()

      toaster.create({
        title: `Bandeira deletada`,
        description: `O Bandeira foi deletada com sucesso!`,
        type: 'success',
      })
    } catch (error) {
      toaster.create({
        title: `Falha ao deletar bandeira`,
        type: 'error',
      })
    }
  }

  const footerButtons: ModalFooterButton[] = [
    {
      text: 'Excluir',
      // colorScheme: 'primary',
      onClick: handleDeleteClick,
      // isLoading: form.formState.isSubmitting,
      loadingText: 'Excluindo',
    },
  ]

  return (
    <BaseModal
      {...rest}
      headerText={'Excluir Bandeira'}
      open={disclosure.open}
      onClose={disclosure.onClose}
      footerButtons={footerButtons}
      size="2xl"
    >
      Tem certeza que deseja excluir a bandeira: {selectedBandeira.name}?
    </BaseModal>
  )
}
