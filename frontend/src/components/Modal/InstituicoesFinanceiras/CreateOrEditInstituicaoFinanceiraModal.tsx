import { Dialog, Flex, UseDisclosureReturn } from '@chakra-ui/react'
import { BaseModal, ModalFooterButton } from '../BaseModal'
import { api } from '@/lib/axios'
import { toaster } from '@/components/ui/toaster'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/Form/Input'
import { InstituicaoFinanceira } from '@/pages/admin/InstituicoesFinanceiras'

const schema = z.object({
  name: z.string().nonempty('O nome é obrigatório'),
  markup: z.union([z.coerce.number().nonnegative(), z.literal('')]).optional(),
  logo_url: z.string().optional(),
})

type CreateOrEditInstituicaoFinanceiraFormSchema = z.infer<typeof schema>

interface CreateOrEditInstituicaoFinanceiraModalProps
  extends Omit<Dialog.RootProps, 'isOpen' | 'onClose' | 'children'> {
  selectedInstituicaoFinanceira?: InstituicaoFinanceira
  onSave: (instituicaoFinanceira: InstituicaoFinanceira) => void
  disclosure: UseDisclosureReturn
}

export function CreateOrEditInstituicaoFinanceiraModal({
  selectedInstituicaoFinanceira,
  onSave,
  disclosure,
  ...rest
}: CreateOrEditInstituicaoFinanceiraModalProps) {
  // const initialRef = useRef(null)

  const isEditing = !!selectedInstituicaoFinanceira

  const form = useForm<CreateOrEditInstituicaoFinanceiraFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: selectedInstituicaoFinanceira?.name ?? '',
      markup: selectedInstituicaoFinanceira?.markup ?? '',
      logo_url: selectedInstituicaoFinanceira?.logo_url ?? '',
    },
  })

  async function handleSaveClick(
    data: CreateOrEditInstituicaoFinanceiraFormSchema,
  ) {
    try {
      let response

      if (isEditing) {
        response = await api.put(
          `/financial-institutions/${selectedInstituicaoFinanceira.id}`,
          data,
        )
      } else {
        response = await api.post('/financial-institutions', {
          ...data,
        })
      }

      onSave(response.data.financialInstitution)

      disclosure.onClose()

      toaster.create({
        title: `Instituição financeira ${isEditing ? 'editada' : 'cadastrada'}`,
        description: `A instituição financeira foi ${isEditing ? 'editada' : 'cadastrada'} com sucesso!`,
        type: 'success',
      })
    } catch (error) {
      toaster.create({
        title: `Falha ao ${isEditing ? 'editar' : 'cadastrar'} instituição financeira`,
        type: 'error',
      })
    }
  }

  const footerButtons: ModalFooterButton[] = [
    {
      text: 'Salvar',
      // colorScheme: 'primary',
      onClick: form.handleSubmit(handleSaveClick),
      // isLoading: form.formState.isSubmitting,
      loadingText: 'Salvando',
    },
  ]

  return (
    <BaseModal
      {...rest}
      headerText={`${isEditing ? 'Editar' : 'Cadastrar'} Instituição financeira`}
      // initialFocusRef={initialRef}
      open={disclosure.open}
      onClose={disclosure.onClose}
      footerButtons={footerButtons}
      size="xl"
    >
      <Flex
        as="form"
        flexDir="column"
        onSubmit={form.handleSubmit(handleSaveClick)}
        gap="4"
      >
        <Field
          label="Nome da instituição financeira"
          invalid={!!form.formState.errors.name}
          errorText={form.formState.errors.name?.message}
          required
        >
          <Input
            register={form.register('name', {
              required: 'O nome é obrigatório',
            })}
          />
        </Field>

        <Field
          label="Ágio"
          invalid={!!form.formState.errors.markup}
          errorText={form.formState.errors.markup?.message}
        >
          <Input register={form.register('markup')} />
        </Field>

        <Field
          label="URL da Logo"
          invalid={!!form.formState.errors.logo_url}
          errorText={form.formState.errors.logo_url?.message}
        >
          <Input register={form.register('logo_url')} />
        </Field>
      </Flex>
    </BaseModal>
  )
}
