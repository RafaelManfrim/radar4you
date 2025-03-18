import { CartaoCard } from '@/components/CartaoCard'
import { useAuth } from '@/contexts/AuthContext'
import {
  Flex,
  Heading,
  HStack,
  Show,
  Tabs,
  Text,
  VStack,
} from '@chakra-ui/react'
import { LuLock, LuSquareCheck } from 'react-icons/lu'
import { Cartao } from './admin/Cartoes'
import { Skeleton } from '@/components/ui/skeleton'
import { NoItemsMessageCard } from './NoItemsMessageCard'
import { useEffect, useState } from 'react'
import { UserCard } from './Cartoes'
import { api } from '@/lib/axios'
import { Avatar, AvatarGroup } from '@/components/ui/avatar'
import { Checkbox } from '@/components/ui/checkbox'
import { FilterValue } from '@/components/Filters'
import { CheckedChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/checkbox/namespace'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormContainer } from '@/components/FormContainer'
import { Input } from '@/components/Form/Input'
import { toaster } from '@/components/ui/toaster'
import axios from 'axios'

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(6),
    newPassword: z.string().min(6),
    confirmNewPassword: z.string().min(6),
  })
  .refine((schema) => schema.newPassword === schema.confirmNewPassword, {
    message: 'As senhas não são iguais',
  })

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>

export function Profile() {
  const [cartoes, setCartoes] = useState<Cartao[]>()
  const [cartoesUsuario, setCartoesUsuario] = useState<UserCard[]>()
  const [notificationTypes] = useState<FilterValue[]>([
    { label: 'Recebimento de Promoções', checked: false, value: 'promotions' },
    { label: 'Atualização com Novidades', checked: false, value: 'news' },
    { label: 'Dicas Importantes', checked: false, value: 'tips' },
  ])

  const [notificationsSelected, setNotificationsSelected] = useState<
    FilterValue[]
  >([])

  const changePasswordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  })

  const { authData } = useAuth()

  const isLoading = !cartoes || !cartoesUsuario

  const allNotificationsChecked = notificationsSelected.every(
    (value) => value.checked,
  )
  const indeterminateNotifications =
    notificationsSelected.some((value) => value.checked) &&
    !allNotificationsChecked

  function handleRootNotificationsClick(e: CheckedChangeDetails) {
    setNotificationsSelected((current) =>
      current.map((value) => ({ ...value, checked: !!e.checked })),
    )
  }

  function handleItemNotificationClick(e: CheckedChangeDetails, index: number) {
    setNotificationsSelected((current) => {
      const newValues = [...current]
      newValues[index] = { ...newValues[index], checked: !!e.checked }
      return newValues
    })
  }

  async function handleChangePassword(data: ChangePasswordFormData) {
    try {
      await api.patch('/users/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      changePasswordForm.reset()

      toaster.create({
        title: 'Senha alterada com sucesso',
        type: 'success',
      })
    } catch (err) {
      console.log(err)

      if (axios.isAxiosError(err) && err.response?.status === 400) {
        toaster.create({
          title: 'Erro ao alterar a senha',
          type: 'error',
          description: err.response.data.message,
        })
      }

      toaster.create({
        title: 'Erro ao alterar a senha',
        type: 'error',
        description: 'Ocorreu um erro ao tentar alterar a senha',
      })
    }
  }

  useEffect(() => {
    async function fetchCartoes() {
      try {
        const response = await api.get('cards')
        setCartoes(response.data.cards)
      } catch (err) {
        console.log(err)
      }
    }

    async function fetchCartoesUsuario() {
      try {
        const response = await api.get('users/cards')
        const userCards = response.data.userCards
        setCartoesUsuario(userCards)
      } catch (err) {
        console.log(err)
      }
    }

    async function fetchNotificaçõesUsuario() {
      try {
        // const response = await api.get('users/notifications')
        // const userNotifications = response.data.userNotifications

        // setNotificationsSelected(
        //   notificationTypes.map((item) => {
        //     const notification = userNotifications.find(
        //       (notification) => notification.type === item.value,
        //     )

        //     return {
        //       ...item,
        //       checked: !!notification,
        //     }
        //   }),
        // )
        setNotificationsSelected(
          notificationTypes.map((notification) => ({
            label: notification.label,
            checked: false,
            value: notification.value,
          })),
        )
      } catch (err) {
        console.log(err)
      }
    }

    fetchCartoes()
    fetchCartoesUsuario()
    fetchNotificaçõesUsuario()
  }, [])

  if (!authData) {
    return null
  }

  return (
    <Flex w="full" justify="center" p="6">
      <Flex justify="start" align="start" gap="4" w="full" maxW={1280}>
        <VStack align="start" justify="start" w="full">
          <VStack
            w="full"
            p="4"
            borderWidth={1}
            borderColor="brand.text"
            borderRadius="md"
            gap="2"
          >
            <Heading color="brand.title" mb="1">
              Meu Perfil
            </Heading>
            <Flex
              justify="start"
              align="start"
              gap="4"
              flexDir={['column', 'column', 'row']}
              w="full"
            >
              <VStack w="full" gap="4">
                <Flex
                  bg="brand.text-transparent"
                  w="full"
                  p="4"
                  borderRadius="md"
                  flexDir={['column', 'column', 'row']}
                  justify={['center', 'center', 'space-between']}
                  align={['start', 'start', 'center']}
                >
                  <HStack w="full">
                    <AvatarGroup>
                      <Avatar
                        size={['md', 'lg']}
                        variant="solid"
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
                    <Flex
                      justify="space-between"
                      gap="0"
                      w="full"
                      flexDir={['column', 'column', 'column', 'row']}
                    >
                      <VStack align="start" gap="0">
                        <Heading
                          as="strong"
                          color="brand.title"
                          size="md"
                          fontWeight="bold"
                          wordBreak="break-word"
                        >
                          {authData.user.first_name}
                        </Heading>
                        <Text
                          as="span"
                          color="brand.secondary"
                          fontSize="sm"
                          wordBreak="break-word"
                        >
                          {authData.user.email}
                        </Text>
                      </VStack>
                      <VStack
                        align={['start', 'start', 'start', 'end']}
                        gap="0"
                      >
                        <Text as="span" color="brand.text-light" fontSize="sm">
                          Membro desde:{' '}
                          <Text
                            as="strong"
                            color="brand.secondary"
                            fontSize="sm"
                          >
                            {new Date(
                              authData.user.created_at,
                            ).toLocaleDateString()}
                          </Text>
                        </Text>
                        <Text as="span" color="brand.text-light" fontSize="sm">
                          Login via:{' '}
                          <Text
                            as="strong"
                            color="brand.secondary"
                            fontSize="sm"
                            textTransform="capitalize"
                          >
                            {authData.user.login_provider}
                          </Text>
                        </Text>
                      </VStack>
                    </Flex>
                  </HStack>
                </Flex>
                <Flex bg="brand.text-transparent" w="full" borderRadius="md">
                  <Tabs.Root
                    defaultValue="notifications"
                    variant="line"
                    className="dark"
                    colorPalette="brand"
                    w="full"
                  >
                    <Tabs.List
                      borderBottomColor="brand.text-transparent"
                      _before={{
                        borderBottomColor: 'brand.text-transparent',
                      }}
                    >
                      <Tabs.Trigger value="notifications">
                        <LuSquareCheck />
                        Notificações
                      </Tabs.Trigger>
                      {authData.user.login_provider === 'email' && (
                        <Tabs.Trigger value="password">
                          <LuLock />
                          Alterar Senha
                        </Tabs.Trigger>
                      )}
                    </Tabs.List>
                    <Tabs.Content value="notifications" p="4">
                      <Flex
                        gap="4"
                        flexDir="column"
                        w="100%"
                        borderWidth={1}
                        borderColor="brand.text"
                        p="4"
                        borderRadius="6px"
                      >
                        <VStack
                          alignSelf="start"
                          justify="start"
                          align="start"
                          className="light"
                        >
                          <Checkbox
                            cursor="pointer"
                            checked={
                              indeterminateNotifications
                                ? 'indeterminate'
                                : allNotificationsChecked
                            }
                            colorPalette="brand"
                            color="brand.text-light"
                            onCheckedChange={(e) =>
                              handleRootNotificationsClick(e)
                            }
                          >
                            Habilitar todas as notificações
                          </Checkbox>
                          {notificationsSelected.map((item, index) => (
                            <Checkbox
                              colorPalette="brand"
                              cursor="pointer"
                              ms="6"
                              key={item.value}
                              checked={item.checked}
                              color="brand.text-light"
                              onCheckedChange={(e) =>
                                handleItemNotificationClick(e, index)
                              }
                            >
                              {item.label}
                            </Checkbox>
                          ))}
                        </VStack>
                        <Button color="brand.title">Salvar</Button>
                      </Flex>
                    </Tabs.Content>
                    {authData.user.login_provider === 'email' && (
                      <Tabs.Content value="password" p="4">
                        <FormContainer
                          maxW="full"
                          onSubmit={changePasswordForm.handleSubmit(
                            handleChangePassword,
                          )}
                        >
                          <Input
                            placeholder="Digite sua senha atual"
                            type="password"
                            register={changePasswordForm.register(
                              'currentPassword',
                            )}
                          />
                          <Input
                            placeholder="Informe sua nova senha"
                            type="password"
                            register={changePasswordForm.register(
                              'newPassword',
                            )}
                          />
                          <Input
                            placeholder="Confirme sua nova senha"
                            type="password"
                            register={changePasswordForm.register(
                              'confirmNewPassword',
                            )}
                          />

                          <Button color="brand.title" type="submit">
                            Alterar
                          </Button>
                        </FormContainer>
                      </Tabs.Content>
                    )}
                  </Tabs.Root>
                </Flex>
              </VStack>
              <VStack
                w="full"
                p="4"
                borderWidth={1}
                borderColor="brand.text"
                borderRadius="md"
                gap="2"
              >
                <Heading color="brand.title" mb="1">
                  Meus Cartões
                </Heading>
                <Show
                  when={!isLoading}
                  children={cartoesUsuario?.map((cartao) => (
                    <CartaoCard
                      key={cartao.id}
                      userCards={cartoesUsuario}
                      card={
                        cartoes?.find(
                          (card) => card.id === cartao.card_id,
                        ) as Cartao
                      }
                      isProfileVisualization
                    />
                  ))}
                  fallback={Array.from({ length: 3 }, (_, i) => i).map(
                    (_, index) => (
                      <Skeleton
                        key={index}
                        className="dark"
                        variant="shine"
                        height="16"
                        w="full"
                      />
                    ),
                  )}
                />
                {cartoesUsuario?.length === 0 && (
                  <NoItemsMessageCard message="Você ainda não possui cartões selecionados" />
                )}
              </VStack>
            </Flex>
          </VStack>
        </VStack>
      </Flex>
    </Flex>
  )
}
