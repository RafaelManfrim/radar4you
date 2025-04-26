import {
  createListCollection,
  Dialog,
  Flex,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  UseDisclosureReturn,
} from '@chakra-ui/react'
import { BaseModal, ModalFooterButton } from '../BaseModal'
import { api } from '@/lib/axios'
import { toaster } from '@/components/ui/toaster'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field } from '@/components/ui/field'
import { Input } from '@/components/Form/Input'
import { Cartao } from '@/pages/admin/Cartoes'
import { Bandeira } from '@/pages/admin/Bandeiras'
import { InstituicaoFinanceira } from '@/pages/admin/InstituicoesFinanceiras'
import { getMoedaByCurrency } from '@/utils/getMoedaByCurrency'
import { Checkbox } from '@/components/ui/checkbox'

const schema = z.object({
  title: z.string().nonempty('O nome é obrigatório'),
  financial_institution_id: z
    .string()
    .nonempty('A instituição financeira é obrigatória')
    .array(),
  card_brand_id: z.string().nonempty('A bandeira é obrigatória').array(),
  points_currency: z.string().nonempty('A moeda é obrigatória').array(),
  points_conversion_rate: z.number({
    invalid_type_error: 'A taxa de conversão é obrigatória',
    required_error: 'A taxa de conversão é obrigatória',
  }),
  is_recommended: z.coerce.boolean().optional(),
  // annual_fee: z.preprocess(
  //   (val) => {
  //     console.log('val ', val)
  //     if (val === '' || val === null || val === undefined) return undefined
  //     const coerced = Number(val)
  //     return isNaN(coerced) ? val : coerced
  //   },
  //   z.union([z.undefined(), z.number().min(1, 'Informe um valor válido')]),
  // ),
  annual_fee: z
    .string()
    .optional()
    .refine(
      (val) =>
        val === undefined ||
        val === '' ||
        (!isNaN(Number(val)) && Number(val) >= 0),
      {
        message: 'Informe um valor válido',
      },
    ),
  benefits: z.string().optional(),
  vip_lounges: z.string().optional(),
  image_url: z.string().optional(),
})

type CreateOrEditCartaoFormSchema = z.infer<typeof schema>

interface CreateOrEditCartaoModalProps
  extends Omit<Dialog.RootProps, 'isOpen' | 'onClose' | 'children'> {
  selectedCartao?: Cartao
  onSave: (cartao: Cartao) => void
  disclosure: UseDisclosureReturn
  bandeiras: Bandeira[]
  instituicoesFinanceiras: InstituicaoFinanceira[]
  moedas: string[]
}

export function CreateOrEditCartaoModal({
  selectedCartao,
  onSave,
  disclosure,
  bandeiras,
  instituicoesFinanceiras,
  moedas,
  ...rest
}: CreateOrEditCartaoModalProps) {
  const isEditing = !!selectedCartao

  const form = useForm<CreateOrEditCartaoFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: selectedCartao?.title ?? '',
      points_currency: [selectedCartao?.points_currency],
      financial_institution_id: [selectedCartao?.financial_institution_id],
      card_brand_id: [selectedCartao?.card_brand_id],
      points_conversion_rate: selectedCartao?.points_conversion_rate,
      annual_fee: String(selectedCartao?.annual_fee) ?? undefined,
      benefits: selectedCartao?.benefits ?? '',
      vip_lounges: selectedCartao?.vip_lounges ?? '',
      is_recommended: selectedCartao?.is_recommended ?? false,
      image_url: selectedCartao?.image_url ?? '',
    },
  })

  async function handleSaveClick(data: CreateOrEditCartaoFormSchema) {
    const body = {
      title: data.title,
      financial_institution_id: data.financial_institution_id[0],
      brand_id: data.card_brand_id[0],
      points_currency: data.points_currency[0],
      points_conversion_rate: data.points_conversion_rate,
      is_recommended: data.is_recommended,
      benefits: data.benefits,
      vip_lounges: data.vip_lounges,
      image_url: data.image_url,
      ...(data.annual_fee === undefined || data.annual_fee === ''
        ? {
            annual_fee: 0,
          }
        : {
            annual_fee: Number(data.annual_fee),
          }),
    }

    try {
      let response

      if (isEditing) {
        response = await api.put(`/cards/${selectedCartao.id}`, body)
      } else {
        response = await api.post('/cards', body)
      }

      onSave(response.data.card)

      disclosure.onClose()

      toaster.create({
        title: `Cartão ${isEditing ? 'editado' : 'cadastrado'}`,
        description: `O cartão foi ${isEditing ? 'editado' : 'cadastrado'} com sucesso!`,
        type: 'success',
      })
    } catch (error) {
      toaster.create({
        title: `Falha ao ${isEditing ? 'editar' : 'cadastrar'} cartão`,
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
      headerText={`${isEditing ? 'Editar' : 'Cadastrar'} Cartão`}
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
          label="Instiuição Financeira"
          invalid={!!form.formState.errors.financial_institution_id}
          errorText={form.formState.errors.financial_institution_id?.message}
          required
        >
          <Controller
            control={form.control}
            name="financial_institution_id"
            render={({ field }) => (
              <SelectRoot
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => field.onChange(value)}
                onInteractOutside={() => field.onBlur()}
                collection={createListCollection({
                  items: instituicoesFinanceiras.map((instituicao) => ({
                    value: instituicao.id,
                    label: instituicao.name,
                  })),
                })}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Selecione a instituição financeira" />
                </SelectTrigger>
                <SelectContent>
                  {instituicoesFinanceiras.map((instituicao) => (
                    <SelectItem item={instituicao.id} key={instituicao.id}>
                      {instituicao.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            )}
          />
        </Field>

        <Field
          label="Bandeira"
          invalid={!!form.formState.errors.card_brand_id}
          errorText={form.formState.errors.card_brand_id?.message}
          required
        >
          <Controller
            control={form.control}
            name="card_brand_id"
            render={({ field }) => (
              <SelectRoot
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => field.onChange(value)}
                onInteractOutside={() => field.onBlur()}
                collection={createListCollection({
                  items: bandeiras.map((bandeira) => ({
                    value: bandeira.id,
                    label: bandeira.name,
                  })),
                })}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Selecione a bandeira" />
                </SelectTrigger>
                <SelectContent>
                  {bandeiras.map((bandeira) => (
                    <SelectItem item={bandeira.id} key={bandeira.id}>
                      {bandeira.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            )}
          />
        </Field>

        <Field
          label="Nome do Cartão"
          invalid={!!form.formState.errors.title}
          errorText={form.formState.errors.title?.message}
          required
        >
          <Input
            register={form.register('title', {
              required: 'O nome é obrigatório',
            })}
          />
        </Field>

        <Field
          label="URL da Imagem"
          invalid={!!form.formState.errors.image_url}
          errorText={form.formState.errors.image_url?.message}
        >
          <Input register={form.register('image_url')} />
        </Field>

        <Field
          label="Moeda de Conversão"
          invalid={!!form.formState.errors.points_currency}
          errorText={form.formState.errors.points_currency?.message}
          required
        >
          <Controller
            control={form.control}
            name="points_currency"
            render={({ field }) => (
              <SelectRoot
                name={field.name}
                value={field.value}
                onValueChange={({ value }) => field.onChange(value)}
                onInteractOutside={() => field.onBlur()}
                collection={createListCollection({
                  items: moedas.map((moeda) => ({
                    value: moeda,
                    label: getMoedaByCurrency(moeda),
                  })),
                })}
              >
                <SelectTrigger>
                  <SelectValueText placeholder="Selecione a moeda" />
                </SelectTrigger>
                <SelectContent>
                  {moedas.map((moeda) => (
                    <SelectItem item={moeda} key={moeda}>
                      {getMoedaByCurrency(moeda)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            )}
          />
        </Field>

        <Field
          label="Pontos"
          invalid={!!form.formState.errors.points_conversion_rate}
          errorText={form.formState.errors.points_conversion_rate?.message}
          required
        >
          <Input
            type="number"
            register={form.register('points_conversion_rate', {
              valueAsNumber: true,
            })}
          />
        </Field>

        <Field
          label="Anuidade"
          invalid={!!form.formState.errors.annual_fee}
          errorText={form.formState.errors.annual_fee?.message}
        >
          <Input type="number" register={form.register('annual_fee')} />
        </Field>

        <Field label="Benefícios">
          <Input
            register={form.register('benefits')}
            placeholder="Digite os benefícios do cartão"
          />
        </Field>

        <Field label="Salas VIP">
          <Input
            register={form.register('vip_lounges')}
            placeholder="Digite as salas VIP do cartão"
          />
        </Field>

        <Controller
          control={form.control}
          name="is_recommended"
          render={({ field }) => (
            <Field>
              <Checkbox
                cursor="pointer"
                colorPalette="brand"
                checked={field.value}
                onCheckedChange={(e) => field.onChange(e.checked)}
              >
                Recomendar aos usuários
              </Checkbox>
            </Field>
          )}
        />
      </Flex>
    </BaseModal>
  )
}
