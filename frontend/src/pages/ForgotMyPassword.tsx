import { Input } from '@/components/Form/Input'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { toaster } from '@/components/ui/toaster'
import { api } from '@/lib/axios'
import { Center, Flex, Text } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import { z } from 'zod'

const forgotMyPasswordSchema = z.object({
  email: z.string().email().nonempty(),
})

export type ForgotMyPasswordFormData = z.infer<typeof forgotMyPasswordSchema>

export function ForgotMyPassword() {
  const form = useForm<ForgotMyPasswordFormData>({
    resolver: zodResolver(forgotMyPasswordSchema),
  })

  async function handleSubmit(data: ForgotMyPasswordFormData) {
    try {
      await api.post('/forgot-my-password', {
        email: data.email,
      })
    } catch (error) {
      console.log(error)

      toaster.create({
        title: 'Houve um erro',
        description:
          'Erro ao solicitar a recuperação de senha, por favor, tente novamente mais tarde',
        duration: 3000,
      })
    }
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
        <h2>
          Preencha seu e-mail abaixo para solicitar a recuperação de senha
        </h2>
        <Input
          placeholder="Digite seu e-mail"
          register={form.register('email')}
        />

        <Button type="submit" fontWeight="bold">
          Enviar
        </Button>

        <hr />

        <Text as="span" fontSize="sm">
          Lembrou sua senha?{' '}
          <Link to="/login">
            <Text as="span" color="purple.500">
              Voltar para o Login
            </Text>
          </Link>
        </Text>
      </Flex>
    </Center>
  )
}
