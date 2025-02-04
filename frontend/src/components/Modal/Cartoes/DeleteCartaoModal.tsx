import { api } from '@/lib/axios'
import { BaseModal, ModalFooterButton } from '../BaseModal'
import { toaster } from '@/components/ui/toaster'
import { Dialog, UseDisclosureReturn } from '@chakra-ui/react'
import { Cartao } from '@/pages/Cartoes'

interface DeleteCartaoModalProps
  extends Omit<Dialog.RootProps, 'isOpen' | 'onClose' | 'children'> {
  selectedCartao: Cartao
  onDelete: (cartao: Cartao) => void
  disclosure: UseDisclosureReturn
}

export function DeleteCartaoModal({
  selectedCartao,
  onDelete,
  disclosure,
  ...rest
}: DeleteCartaoModalProps) {
  async function handleDeleteClick() {
    try {
      await api.delete(`/cards/${selectedCartao.id}`)

      onDelete(selectedCartao)

      disclosure.onClose()

      toaster.create({
        title: 'Cartão deletado',
        description: `O cartão foi deletado com sucesso!`,
        type: 'success',
      })
    } catch (error) {
      toaster.create({
        title: 'Falha ao deletar cartão',
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
      headerText="Excluir Cartão"
      open={disclosure.open}
      onClose={disclosure.onClose}
      footerButtons={footerButtons}
      size="2xl"
    >
      Tem certeza que deseja excluir o cartão:{' '}
      {selectedCartao.financial_institution_name} {selectedCartao.title} (
      {selectedCartao.card_brand_name})?
    </BaseModal>
  )
}
