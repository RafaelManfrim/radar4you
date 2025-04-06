import { z } from 'zod'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Center, Text, Separator } from '@chakra-ui/react'
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
import { Field } from '@/components/ui/field'
import { useState } from 'react'

const registerSchema = z
  .object({
    firstName: z.string().nonempty('Campo obrigatório'),
    email: z.string().email('Informe um e-mail válido').nonempty(),
    password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z
      .string()
      .min(6, 'A senha deve ter no mínimo 6 caracteres'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'Você deve aceitar os termos de uso',
    }),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: 'As senhas não são iguais',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>

export function Register() {
  const [isLoading, setIsLoading] = useState(false)

  const { signInwithGoogle, register } = useAuth()

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  async function handleRegistration(data: RegisterFormData) {
    try {
      setIsLoading(true)
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
        onSubmit={form.handleSubmit(handleRegistration)}
        color="brand.title"
      >
        <Center>
          <Logo my="6" />
        </Center>

        <Field
          label="Primeiro nome"
          invalid={!!form.formState.errors.firstName}
          errorText={form.formState.errors.firstName?.message}
          required
        >
          <Input
            placeholder="Digite seu primeiro nome"
            register={form.register('firstName')}
          />
        </Field>

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
          <Input
            placeholder="Digite sua senha"
            type="password"
            register={form.register('password')}
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect="off"
          />
        </Field>

        <Field
          label="Confirme sua senha"
          invalid={!!form.formState.errors.confirmPassword}
          errorText={form.formState.errors.confirmPassword?.message}
          required
        >
          <Input
            placeholder="Confirme sua senha"
            type="password"
            register={form.register('confirmPassword')}
            autoComplete="current-password"
            autoCapitalize="none"
            autoCorrect="off"
          />
        </Field>

        <Field
          invalid={!!form.formState.errors.terms}
          errorText={form.formState.errors.terms?.message}
        >
          <Checkbox
            colorPalette="brand"
            color="brand.text"
            onChange={(e) => {
              const target = e.target as HTMLInputElement
              form.setValue('terms', target.checked)
              form.clearErrors('terms')
            }}
            checked={form.getValues('terms')}
          >
            Eu aceito os{' '}
            <Link to="https://google.com" target="_blank">
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
                termos de uso
              </Text>
            </Link>{' '}
            e a{' '}
            <Link to="https://google.com" target="_blank">
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
                política de privacidade
              </Text>
            </Link>
          </Checkbox>
        </Field>

        <Button type="submit">
          {isLoading ? 'Registrando...' : 'Registrar-se'}
        </Button>

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
