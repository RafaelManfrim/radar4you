import { Box, Flex, HStack } from '@chakra-ui/react'
import { Logo } from './Logo'
import { NavLinkComponent } from './NavLink'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Can } from './Can'

import {
  MenuContent,
  MenuItem,
  MenuItemGroup,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/menu'
import { Avatar, AvatarGroup } from './ui/avatar'

const navegacao = [
  { title: 'Calculadora', to: '/calculadora' },
  { title: 'Cartões', to: '/calculadora/cartoes' },
  { title: 'Histórico', to: '/calculadora/historico' },
  { title: 'Perfil', to: '/calculadora/perfil' },
]

export function Header() {
  const { signOut, authData } = useAuth()
  const navigate = useNavigate()

  return (
    <Flex as="header" w="full" bg="gray.200" justify="center" p="6">
      <Flex justify="space-between" align="center" w="full" maxW={1280}>
        <Logo />

        <MenuRoot>
          <MenuTrigger asChild>
            <HStack
              cursor="pointer"
              bgColor="gray.300"
              p="2"
              px="4"
              borderRadius="md"
              _hover={{
                filter: 'brightness(0.9)',
                transition: '0.2s ease-out',
              }}
            >
              <Box as="span" fontSize={14}>
                Olá, {authData?.user?.first_name}
              </Box>
              <AvatarGroup>
                <Avatar
                  size="xs"
                  variant="subtle"
                  name={authData?.user?.first_name}
                />
              </AvatarGroup>
            </HStack>
          </MenuTrigger>
          <MenuContent>
            <MenuItemGroup title="Navegação">
              {navegacao.map((item, index) => (
                <MenuItem
                  key={index}
                  value={item.to}
                  onClick={() => navigate(item.to)}
                  cursor="pointer"
                >
                  <NavLinkComponent title={item.title} to={item.to} />
                </MenuItem>
              ))}
            </MenuItemGroup>
            <MenuSeparator />
            <MenuItemGroup title="Ações">
              <Can>
                <MenuItem
                  value="admin"
                  cursor="pointer"
                  onClick={() => navigate('/admin')}
                >
                  Admin
                </MenuItem>
              </Can>
              <MenuItem
                value="sair"
                color="fg.error"
                cursor="pointer"
                _hover={{ bg: 'bg.error', color: 'fg.error' }}
                onClick={signOut}
              >
                Sair
              </MenuItem>
            </MenuItemGroup>
          </MenuContent>
        </MenuRoot>
      </Flex>
    </Flex>
  )
}
