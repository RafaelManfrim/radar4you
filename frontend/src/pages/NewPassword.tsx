import { Input } from '@/components/Form/Input'
import { FormContainer } from '@/components/FormContainer'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { toaster } from '@/components/ui/toaster'
import { api } from '@/lib/axios'
import { Center, Text } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
  const navigate = useNavigate()

  async function handleSubmit(data: NewPasswordFormData) {
    try {
      await api.post('/new-password', {
        token: params.token,
        password: data.password,
      })

      toaster.create({
        title: 'Senha alterada com sucesso',
        description: 'Sua senha foi alterada com sucesso, faça login',
      })

      navigate('/login')
    } catch (error) {
      console.log(error)

      toaster.create({
        title: 'Houve um erro',
        description:
          'Erro ao trocar a senha, por favor, tente novamente mais tarde',
      })
    }
  }

  if (!params.token) {
    return null
  }

  return (
    <Center h="100vh" px="6">
      <FormContainer onSubmit={form.handleSubmit(handleSubmit)}>
        <Center>
          <Link to="/">
            <Logo my="6" />
          </Link>
        </Center>
        <Text textAlign="center">
          Preencha os campos abaixo para alterar sua senha
        </Text>
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
      </FormContainer>
    </Center>
  )
}
