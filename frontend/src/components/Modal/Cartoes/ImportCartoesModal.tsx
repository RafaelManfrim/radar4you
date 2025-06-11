import {
  Dialog,
  Flex,
  FileUpload,
  UseDisclosureReturn,
  Icon,
  Box,
  Progress,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { api } from '@/lib/axios'
import { toaster } from '@/components/ui/toaster'

import { BaseModal, ModalFooterButton } from '../BaseModal'
import { LuUpload } from 'react-icons/lu'
import { useEffect, useState } from 'react'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ACCEPTED_MIME_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'

const schema = z.object({
  spreadsheet: z
    .instanceof(FileList)
    .refine((files) => files?.length > 0, 'O arquivo é obrigatório.')
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `O tamanho máximo do arquivo é 10MB.`,
    )
    .refine(
      (files) => files?.[0]?.type === ACCEPTED_MIME_TYPE,
      'O arquivo deve ser uma planilha Excel (.xlsx).',
    ),
})

type ImportCartoesFormSchema = z.infer<typeof schema>

interface ImportCartoesModalProps
  extends Omit<Dialog.RootProps, 'isOpen' | 'onClose' | 'children'> {
  onImport: () => void
  disclosure: UseDisclosureReturn
}

export function ImportCartoesModal({
  onImport,
  disclosure,
  ...rest
}: ImportCartoesModalProps) {
  const [uploadProgress, setUploadProgress] = useState(0)

  const form = useForm<ImportCartoesFormSchema>({
    resolver: zodResolver(schema),
  })

  const selectedFile = form.watch('spreadsheet')?.[0] || null

  console.log('selectedFile', selectedFile)

  async function handleSaveClick(data: ImportCartoesFormSchema) {
    setUploadProgress(0)

    const file = data.spreadsheet[0]

    const requestData = new FormData()
    requestData.append('file', file)

    try {
      const response = await api.post('/cards/import', requestData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total ?? 1),
          )
          setUploadProgress(percentCompleted)
        },
      })

      onImport()

      disclosure.onClose()

      toaster.create({
        title: 'Cartões importados com sucesso',
        description: `Foram importados ${response.data.rowCount} cartões.`,
        type: 'success',
      })
    } catch (error) {
      toaster.create({
        title: 'Erro ao importar cartões',
        type: 'error',
      })
    } finally {
      setUploadProgress(0)
    }
  }

  const footerButtons: ModalFooterButton[] = [
    {
      text: 'Importar',
      // colorScheme: 'primary',
      onClick: form.handleSubmit(handleSaveClick),
      // isLoading: form.formState.isSubmitting,
      loadingText: 'Importando',
    },
  ]

  useEffect(() => {
    console.log('selectedFile changed:', selectedFile)
  }, [selectedFile])

  return (
    <BaseModal
      {...rest}
      headerText="Importar Cartões"
      open={disclosure.open}
      onClose={disclosure.onClose}
      footerButtons={footerButtons}
      size="sm"
    >
      <Flex
        as="form"
        flexDir="column"
        onSubmit={form.handleSubmit(handleSaveClick)}
        gap="4"
      >
        <FileUpload.Root
          maxW="xl"
          alignItems="stretch"
          maxFiles={1}
          accept={ACCEPTED_MIME_TYPE}
          {...form.register('spreadsheet')}
        >
          <FileUpload.HiddenInput />
          <FileUpload.Dropzone>
            <Icon size="md" color="fg.muted">
              <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
              <Box>Arraste e solte seu arquivo aqui</Box>
              <Box color="fg.muted">.xlsx de até 10 MB.</Box>
            </FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
          {selectedFile && (
            <FileUpload.ItemGroup>
              <FileUpload.Item file={selectedFile}>
                <FileUpload.ItemContent>
                  <FileUpload.ItemName />
                </FileUpload.ItemContent>
              </FileUpload.Item>
            </FileUpload.ItemGroup>
          )}
        </FileUpload.Root>
        {uploadProgress > 0 && (
          <Progress.Root value={uploadProgress} colorScheme="primary" size="sm">
            <Progress.Track>
              <Progress.Range />
            </Progress.Track>
            <Progress.Label />
            <Progress.ValueText />
          </Progress.Root>
        )}
      </Flex>
    </BaseModal>
  )
}
