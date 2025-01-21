import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { Center, Flex, Input } from '@chakra-ui/react'

import {
  FacebookLoginButton,
  GoogleLoginButton,
} from 'react-social-login-buttons'

export function Login() {
  const { signInwithGoogle } = useAuth()

  return (
    <Center h="100vh">
      <Flex gap="4" flexDir="column" w="100%" maxW="96">
        <Logo />
        <h2>Bem vindo!</h2>
        <Input placeholder="Digite seu e-mail" />
        <Input placeholder="Digite sua senha" />

        <p>
          <a href="">Esqueci minha senha</a>
        </p>

        <Button>Entrar</Button>

        <hr />

        <span>
          Não possui uma conta? <a href="">Registre-se</a>
        </span>

        <p>Ou</p>

        <GoogleLoginButton
          text="Entrar com Google"
          style={{
            height: '42px',
            fontSize: '18px',
            lineHeight: '18px',
            width: '100%',
            margin: '0',
            boxShadow: 'rgba(0, 0, 0, 0.3) 0px 1px 2px',
          }}
          onClick={signInwithGoogle}
        />

        {/* <FacebookLoginButton
          style={{
            height: '42px',
            fontSize: '18px',
            lineHeight: '18px',
            width: '100%',
            margin: '0',
          }}
          text="Entrar com Facebook"
        /> */}
      </Flex>
    </Center>
  )
}
