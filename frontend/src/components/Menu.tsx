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
import { HStack, Text } from '@chakra-ui/react'

const navegacao = [
  { title: 'Calculadora', to: '/' },
  { title: 'Cartões', to: '/cartoes' },
  { title: 'Histórico', to: '/historico' },
  { title: 'Perfil', to: '/perfil' },
]

export function Menu() {
  const { signOut, authData } = useAuth()
  const navigate = useNavigate()

  return (
    <MenuRoot>
      <MenuTrigger asChild>
        <HStack
          cursor="pointer"
          // bgColor="brand.text"
          borderWidth={1}
          borderColor="brand.text"
          p={['1', '2']}
          px={['2', '4']}
          borderRadius="md"
          _hover={{
            filter: 'brightness(0.9)',
            transition: '0.2s ease-out',
          }}
        >
          <Text as="span" fontSize={[12, 14]} color="brand.title">
            Olá, {authData?.user?.first_name}
          </Text>
          <AvatarGroup>
            <Avatar
              size="xs"
              variant="subtle"
              name={authData?.user?.first_name}
              bgColor="brand.secondary"
              borderColor="brand.title"
              color="brand.title"
              _hover={{
                filter: 'brightness(0.9)',
                transition: '0.2s ease-out',
              }}
            />
          </AvatarGroup>
        </HStack>
      </MenuTrigger>
      <MenuContent
        bgColor="brand.background"
        borderWidth={1}
        borderColor="brand.text"
      >
        <MenuItemGroup color="brand.title" title="Navegação">
          {navegacao.map((item, index) => (
            <MenuItem
              key={index}
              value={item.to}
              cursor="pointer"
              color="brand.text"
              _hover={{
                bg: 'brand.text-transparent',
                color: 'brand.title',
              }}
              onClick={() => navigate(item.to)}
            >
              <NavLinkComponent title={item.title} to={item.to} />
            </MenuItem>
          ))}
        </MenuItemGroup>
        <MenuSeparator borderColor="brand.text" />
        <MenuItemGroup color="brand.title" title="Ações">
          <Can>
            <MenuItem
              value="admin"
              cursor="pointer"
              color="brand.text"
              _hover={{
                bg: 'brand.text-transparent',
                color: 'brand.title',
              }}
              onClick={() => navigate('/admin')}
            >
              <Text fontWeight="medium">Admin</Text>
            </MenuItem>
          </Can>
          <MenuItem
            value="sair"
            cursor="pointer"
            color="brand.danger"
            _hover={{ bg: 'brand.text-transparent', color: 'brand.danger' }}
            onClick={signOut}
          >
            Sair
          </MenuItem>
        </MenuItemGroup>
      </MenuContent>
    </MenuRoot>
  )
}
