import { Box, Center, Flex } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { GoogleLoginButton } from 'react-social-login-buttons'

import { Input } from '@/components/Form/Input'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { toaster } from '@/components/ui/toaster'
import { useAuth } from '@/contexts/AuthContext'

const signInSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().min(6),
})

export type SignInFormData = z.infer<typeof signInSchema>

export function Login() {
  const { signInwithGoogle, signIn } = useAuth()

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  async function handleSignIn(data: SignInFormData) {
    try {
      await signIn({
        login_provider: 'email',
        credentials: {
          email: data.email,
          password: data.password,
        },
      })
    } catch (error) {
      console.log(error)

      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return toaster.create({
          title: 'Houve um erro',
          description: error.response.data.message,
          duration: 3000,
        })
      }

      toaster.create({
        title: 'Houve um erro',
        description:
          'Erro ao fazer login, por favor, tente novamente mais tarde',
        duration: 3000,
      })
    }
  }

  async function handleSignInWithGoogle() {
    try {
      await signInwithGoogle()
    } catch (error) {
      console.log(error)

      if (axios.isAxiosError(error) && error.response?.status === 400) {
        return toaster.create({
          title: 'Houve um erro',
          description: error.response.data.message,
          duration: 3000,
        })
      }

      toaster.create({
        title: 'Houve um erro',
        description:
          'Erro ao fazer login, por favor, tente novamente mais tarde',
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
        onSubmit={form.handleSubmit(handleSignIn)}
      >
        <Logo />
        <h2>Bem vindo!</h2>
        <Input
          placeholder="Digite seu e-mail"
          register={form.register('email')}
        />
        <Input
          placeholder="Digite sua senha"
          type="password"
          register={form.register('password')}
        />

        <p>
          <a href="">Esqueci minha senha</a>
        </p>

        <Button type="submit">Entrar</Button>

        <hr />

        <span>
          Não possui uma conta?{' '}
          <Link to="/registro">
            <Box as="span" color="purple.500">
              Registre-se
            </Box>
          </Link>
        </span>

        <Flex bgColor="purple.400" h="2px" justify="center" align="center">
          <Box bgColor="white" px="2" color="purple.500">
            Ou
          </Box>
        </Flex>

        <GoogleLoginButton
          text="Entre com o Google"
          style={{
            height: '42px',
            fontSize: '18px',
            lineHeight: '18px',
            width: '100%',
            margin: '0',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 2px',
          }}
          onClick={handleSignInWithGoogle}
        />
      </Flex>
    </Center>
  )
}
