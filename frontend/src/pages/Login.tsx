import { Center, Flex, IconButton, Separator, Text } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { GoogleLoginButton } from 'react-social-login-buttons'

import { Logo } from '@/components/Logo'
import { Input } from '@/components/Form/Input'
import { Button } from '@/components/ui/button'
import { toaster } from '@/components/ui/toaster'
import { useAuth } from '@/contexts/AuthContext'
import { OrSeparator } from '@/components/OrSeparator'
import { FormContainer } from '@/components/FormContainer'
import { Field } from '@/components/ui/field'
import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const signInSchema = z.object({
  email: z
    .string()
    .email('Informe um e-mail válido')
    .nonempty('Campo obrigatório'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
})

export type SignInFormData = z.infer<typeof signInSchema>

export function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signInwithGoogle, signIn } = useAuth()

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev)
  }

  async function handleSignIn(data: SignInFormData) {
    try {
      setIsLoading(true)
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
        })
      }

      toaster.create({
        title: 'Houve um erro',
        description:
          'Erro ao fazer login, por favor, tente novamente mais tarde',
      })
    } finally {
      setIsLoading(false)
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
        })
      }

      toaster.create({
        title: 'Houve um erro',
        description:
          'Erro ao fazer login, por favor, tente novamente mais tarde',
      })
    }
  }

  return (
    <Center h="100vh" px="6">
      <FormContainer
        onSubmit={form.handleSubmit(handleSignIn)}
        color="brand.title"
      >
        <Center>
          <Logo my="6" />
        </Center>

        <Field
          label="Email"
          invalid={!!form.formState.errors.email}
          errorText={form.formState.errors.email?.message}
          required
        >
          <Input
            placeholder="Digite seu e-mail"
            register={form.register('email')}
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
          />
        </Field>

        <Field
          label="Senha"
          invalid={!!form.formState.errors.password}
          errorText={form.formState.errors.password?.message}
          required
        >
          <Flex w="100%" align="center" gap="2">
            <Input
              placeholder="Digite sua senha"
              type={showPassword ? 'text' : 'password'}
              register={form.register('password')}
              autoComplete="current-password"
              autoCapitalize="none"
              autoCorrect="off"
            />

            <IconButton
              variant="ghost"
              onClick={togglePasswordVisibility}
              aria-label="Visualizar senha"
              colorPalette="blackAlpha"
              _hover={{
                backgroundColor: 'brand.text-transparent',
                color: 'brand.secondary',
                transition: '0.2s ease',
              }}
              {...(showPassword && { color: 'brand.secondary' })}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </IconButton>
          </Flex>
        </Field>

        <Flex justify="end">
          <Link to="/esqueci-minha-senha">
            <Text
              as="span"
              color="brand.secondary"
              textAlign="right"
              fontSize="sm"
              fontWeight="bold"
              _hover={{
                textDecoration: 'underline',
                filter: 'brightness(0.9)',
                transition: '0.2s ease',
              }}
            >
              Esqueci minha senha
            </Text>
          </Link>
        </Flex>

        <Button type="submit" fontWeight="bold">
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>

        <Separator borderColor="brand.text" />

        <Text as="span" fontSize="sm">
          Não possui uma conta?{' '}
          <Link to="/registro">
            <Text
              as="span"
              color="brand.secondary"
              fontWeight="bold"
              _hover={{
                textDecoration: 'underline',
                filter: 'brightness(0.9)',
                transition: '0.2s ease',
              }}
            >
              Crie sua conta
            </Text>
          </Link>
        </Text>

        <OrSeparator />

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
      </FormContainer>
    </Center>
  )
}
