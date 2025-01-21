import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Center, Flex, Input } from '@chakra-ui/react'

export function Register() {
  return (
    <Center h="100vh">
      <Flex gap="4" flexDir="column" minW="96">
        <Logo />
        <h2>Registro</h2>
        <Input placeholder="Digite seu primeiro nome" />
        <Input placeholder="Digite seu e-mail" />
        <Input placeholder="Digite sua senha" />
        <Input placeholder="Confirme sua senha" />
        <Checkbox>
          Eu aceito os <a href="">termos de uso</a> e a{' '}
          <a href="">política de privacidade</a>
        </Checkbox>

        <Button>Registrar-se</Button>

        <hr />

        <span>Possui uma conta?</span>

        <p>
          <a href="">Entre</a>
        </p>

        <Button mb="4">Entrar com Google</Button>

        <Button mb="4">Entrar com Facebook</Button>
      </Flex>
    </Center>
  )
}
