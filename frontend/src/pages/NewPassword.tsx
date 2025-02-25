import { Input } from '@/components/Form/Input'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { toaster } from '@/components/ui/toaster'
import { api } from '@/lib/axios'
import { Center, Flex } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useParams } from 'react-router-dom'
import { z } from 'zod'

const newPasswordSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: 'As senhas não são iguais',
  })

export type NewPasswordFormData = z.infer<typeof newPasswordSchema>

export function NewPassword() {
  const form = useForm<NewPasswordFormData>({
    resolver: zodResolver(newPasswordSchema),
  })

  const params = useParams()

  async function handleSubmit(data: NewPasswordFormData) {
    try {
      await api.post('/new-password', {
        token: params.token,
        password: data.password,
      })
    } catch (error) {
      console.log(error)

      toaster.create({
        title: 'Houve um erro',
        description:
          'Erro ao trocar a senha, por favor, tente novamente mais tarde',
        duration: 3000,
      })
    }
  }

  if (!params.token) {
    return null
  }

  return (
    <Center h="100vh">
      <Flex
        as="form"
        gap="4"
        flexDir="column"
        w="100%"
        maxW="96"
        bg="gray.50"
        p="4"
        borderRadius="6px"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <Logo />
        <h2>Preencha os campos abaixo para alterar sua senha</h2>
        <Input
          placeholder="Digite sua nova senha"
          type="password"
          register={form.register('password')}
        />
        <Input
          placeholder="Confirme sua nova senha"
          type="password"
          register={form.register('confirmPassword')}
        />

        <Button type="submit" fontWeight="bold">
          Alterar
        </Button>
      </Flex>
    </Center>
  )
}
