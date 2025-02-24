import { api } from '@/lib/axios'
import { BaseModal, ModalFooterButton } from '../BaseModal'
import { toaster } from '@/components/ui/toaster'
import { Dialog, UseDisclosureReturn } from '@chakra-ui/react'
import { InstituicaoFinanceira } from '@/pages/admin/InstituicoesFinanceiras'

interface DeleteInstituicaoFinanceiraModalProps
  extends Omit<Dialog.RootProps, 'isOpen' | 'onClose' | 'children'> {
  selectedInstituicaoFinanceira: InstituicaoFinanceira
  onDelete: (instituicaoFinanceira: InstituicaoFinanceira) => void
  disclosure: UseDisclosureReturn
}

export function DeleteInstituicaoFinanceiraModal({
  selectedInstituicaoFinanceira,
  onDelete,
  disclosure,
  ...rest
}: DeleteInstituicaoFinanceiraModalProps) {
  async function handleDeleteClick() {
    try {
      await api.delete(
        `/financial-institutions/${selectedInstituicaoFinanceira.id}`,
      )

      onDelete(selectedInstituicaoFinanceira)

      disclosure.onClose()

      toaster.create({
        title: `Instituição financeira deletada`,
        description: `A instituição financeira foi deletada com sucesso!`,
        type: 'success',
      })
    } catch (error) {
      toaster.create({
        title: `Falha ao deletar instituição financeira`,
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
      headerText="Excluir Instituição financeira"
      open={disclosure.open}
      onClose={disclosure.onClose}
      footerButtons={footerButtons}
      size="xl"
    >
      Tem certeza que deseja excluir a instituição financeira:{' '}
      {selectedInstituicaoFinanceira.name}?
    </BaseModal>
  )
}
