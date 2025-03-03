import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Center, Text, Link as ChakraLink, Separator } from '@chakra-ui/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { GoogleLoginButton } from 'react-social-login-buttons'
import axios from 'axios'

import { Logo } from '@/components/Logo'
import { Input } from '@/components/Form/Input'
import { Button } from '@/components/ui/button'
import { toaster } from '@/components/ui/toaster'
import { Checkbox } from '@/components/ui/checkbox'
import { OrSeparator } from '@/components/OrSeparator'
import { FormContainer } from '@/components/FormContainer'

import { useAuth } from '@/contexts/AuthContext'

const registerSchema = z
  .object({
    firstName: z.string().nonempty(),
    email: z.string().email().nonempty(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: 'As senhas não são iguais',
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export function Register() {
  const { signInwithGoogle, register } = useAuth()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  async function handleRegistration(data: RegisterFormData) {
    try {
      await register({
        email: data.email,
        first_name: data.firstName,
        password: data.password,
        login_provider: 'email',
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
    <Center h="100vh" px="6">
      <FormContainer onSubmit={form.handleSubmit(handleRegistration)}>
        <Center>
          <Logo my="6" />
        </Center>

        <Input
          placeholder="Digite seu primeiro nome"
          register={form.register('firstName')}
        />
        <Input
          placeholder="Digite seu e-mail"
          register={form.register('email')}
        />
        <Input
          placeholder="Digite sua senha"
          type="password"
          register={form.register('password')}
        />
        <Input
          placeholder="Confirme sua senha"
          type="password"
          register={form.register('confirmPassword')}
        />

        <Checkbox colorPalette="brand" inputProps={{ required: true }}>
          Eu aceito os{' '}
          <ChakraLink colorPalette="brand" href="https://google.com">
            termos de uso
          </ChakraLink>{' '}
          e a{' '}
          <ChakraLink colorPalette="brand" href="https://google.com">
            política de privacidade
          </ChakraLink>
        </Checkbox>

        <Button type="submit">Registrar-se</Button>

        <Separator borderColor="brand.text" />

        <Text as="span" fontSize="sm">
          Possui uma conta?{' '}
          <Link to="/login">
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
              Entrar
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
