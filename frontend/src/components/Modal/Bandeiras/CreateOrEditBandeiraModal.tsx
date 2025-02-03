import { Dialog, Flex, UseDisclosureReturn } from '@chakra-ui/react'
// import { useRef } from 'react'
import { BaseModal, ModalFooterButton } from '../BaseModal'
import { Bandeira } from '@/pages/Bandeiras'
import { api } from '@/lib/axios'
import { toaster } from '@/components/ui/toaster'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/Form/Input'

const schema = z.object({
  name: z.string().nonempty('O nome é obrigatório'),
  logo_url: z.string().optional(),
})

type CreateOrEditBandeiraFormSchema = z.infer<typeof schema>

interface CreateOrEditBandeiraModalProps
  extends Omit<Dialog.RootProps, 'isOpen' | 'onClose' | 'children'> {
  selectedBandeira?: Bandeira
  onSave: (bandeira: Bandeira) => void
  disclosure: UseDisclosureReturn
}

export function CreateOrEditBandeiraModal({
  selectedBandeira,
  onSave,
  disclosure,
  ...rest
}: CreateOrEditBandeiraModalProps) {
  // const initialRef = useRef(null)

  const isEditing = !!selectedBandeira

  const form = useForm<CreateOrEditBandeiraFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: selectedBandeira?.name ?? '',
      logo_url: selectedBandeira?.logo_url ?? '',
    },
  })

  async function handleSaveClick(data: CreateOrEditBandeiraFormSchema) {
    try {
      let response

      if (isEditing) {
        response = await api.put(`/card-brands/${selectedBandeira.id}`, data)
      } else {
        response = await api.post('/card-brands', {
          ...data,
        })
      }

      onSave(response.data.cardBrand)

      disclosure.onClose()

      toaster.create({
        title: `Bandeira ${isEditing ? 'editada' : 'cadastrada'}`,
        description: `A bandeira foi ${isEditing ? 'editada' : 'cadastrada'} com sucesso!`,
        type: 'success',
      })
    } catch (error) {
      toaster.create({
        title: `Falha ao ${isEditing ? 'editar' : 'cadastrar'} bandeira`,
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
      headerText={`${isEditing ? 'Editar' : 'Cadastrar'} Bandeira`}
      // initialFocusRef={initialRef}
      open={disclosure.open}
      onClose={disclosure.onClose}
      footerButtons={footerButtons}
      size="2xl"
    >
      <Flex
        as="form"
        flexDir="column"
        onSubmit={form.handleSubmit(handleSaveClick)}
        gap="4"
      >
        <Field
          label="Nome da Bandeira"
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
