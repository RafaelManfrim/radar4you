import { Center, Flex, HStack, Separator, Text } from '@chakra-ui/react'
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
        // bg="black"
        borderWidth={1}
        borderColor="brand.text"
        p="4"
        borderRadius="6px"
        onSubmit={form.handleSubmit(handleSignIn)}
      >
        <Center>
          <Logo my="6" />
        </Center>

        <Input
          placeholder="Digite seu e-mail"
          register={form.register('email')}
        />
        <Input
          placeholder="Digite sua senha"
          type="password"
          register={form.register('password')}
        />

        <Text
          as="p"
          color="brand.primary"
          fontSize="sm"
          textAlign="right"
          _hover={{
            textDecoration: 'underline',
            filter: 'brightness(0.9)',
            transition: '0.2s ease',
          }}
        >
          <Link to="/esqueci-minha-senha">Esqueci minha senha</Link>
        </Text>

        <Button type="submit" fontWeight="bold">
          Entrar
        </Button>

        <Separator borderColor="brand.text" />

        <Text as="span" fontSize="sm">
          Não possui uma conta?{' '}
          <Link to="/registro">
            <Text
              as="span"
              color="brand.primary"
              _hover={{
                textDecoration: 'underline',
                filter: 'brightness(0.9)',
                transition: '0.2s ease',
              }}
            >
              Registre-se
            </Text>
          </Link>
        </Text>

        <HStack>
          <Separator flex="1" borderColor="brand.primary" />
          <Text flexShrink="0" px="2" color="brand.primary" fontSize="sm">
            Ou
          </Text>
          <Separator flex="1" borderColor="brand.primary" />
        </HStack>

        <GoogleLoginButton
          text="Entre com o Google"
          style={{
            height: '38px',
            fontSize: '14px',
            lineHeight: '14px',
            width: '100%',
            margin: '0',
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 2px',
            color: 'white',
            backgroundColor: '#7e7d9a',
            fontWeight: 'bold',
          }}
          activeStyle={{
            filter: 'brightness(0.9)',
            transition: '0.2s ease',
          }}
          onClick={handleSignInWithGoogle}
        />
      </Flex>
    </Center>
  )
}
