import { Input } from '@/components/Form/Input'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { Box, Center, Flex } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

import { GoogleLoginButton } from 'react-social-login-buttons'
import { z } from 'zod'

export const signInSchema = z.object({
  email: z.string().email().nonempty(),
  password: z.string().min(6),
})

export type SignInFormData = z.infer<typeof signInSchema>

export function Login() {
  const { signInwithGoogle, signIn } = useAuth()

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  function handleSignIn(data: SignInFormData) {
    signIn({
      login_provider: 'email',
      credentials: {
        email: data.email,
        password: data.password,
      },
    })
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
          onClick={signInwithGoogle}
        />
      </Flex>
    </Center>
  )
}
