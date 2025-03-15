import { Card } from '@/components/Card'
import { DeleteCartaoModal } from '@/components/Modal/Cartoes/DeleteCartaoModal'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'
import {
  Flex,
  HStack,
  IconButton,
  Table,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { Bandeira } from './Bandeiras'
import { InstituicaoFinanceira } from './InstituicoesFinanceiras'
import { CreateOrEditCartaoModal } from '@/components/Modal/Cartoes/CreateOrEditCartaoModal'
import { getMoedaByCurrency } from '@/utils/getMoedaByCurrency'
import { FaPencil } from 'react-icons/fa6'
import { FaTrash } from 'react-icons/fa'

export interface Cartao {
  id: string
  title: string
  financial_institution_id: string
  card_brand_id: string
  points_currency: 'USD' | 'BRL'
  points_conversion_rate: number
  created_at: Date
  updated_at: Date
  financial_institution_name: string
  financial_institution_logo_url: string | null
  card_brand_name: string
  card_brand_logo_url: string | null
}

export function Cartoes() {
  const [cartoes, setCartoes] = useState<Cartao[]>()
  const [selectedCartao, setSelectedCartao] = useState<Cartao>()

  const [bandeiras, setBandeiras] = useState<Bandeira[]>()
  const [instituicoesFinanceiras, setInstituicoesFinanceiras] =
    useState<InstituicaoFinanceira[]>()
  const [moedas] = useState<string[]>(['USD', 'BRL'])

  const createOrEditCartaoDisclosure = useDisclosure()
  const deleteCartaoDisclosure = useDisclosure()

  function handleCreateCartao() {
    setSelectedCartao(undefined)
    createOrEditCartaoDisclosure.onOpen()
  }

  function handleUpdateCartao(cartao: Cartao) {
    setSelectedCartao(cartao)
    createOrEditCartaoDisclosure.onOpen()
  }

  function handleDeleteCartao(cartao: Cartao) {
    setSelectedCartao(cartao)
    deleteCartaoDisclosure.onOpen()
  }

  function onSaveCartao(cartao: Cartao) {
    setSelectedCartao(undefined)

    setCartoes((prevCartoes) => {
      if (prevCartoes) {
        const cartaoIndex = prevCartoes.findIndex(
          (prevCartao) => prevCartao.id === cartao.id,
        )

        if (cartaoIndex !== -1) {
          prevCartoes[cartaoIndex] = cartao
          return [...prevCartoes]
        }

        return [...prevCartoes, cartao].sort((a, b) => {
          if (a.financial_institution_name > b.financial_institution_name) {
            return 1
          }

          if (a.financial_institution_name < b.financial_institution_name) {
            return -1
          }

          return 0
        })
      }

      return [cartao]
    })
  }

  function onDeleteCartao(cartao: Cartao) {
    setSelectedCartao(undefined)

    setCartoes((prevCartoes) =>
      prevCartoes?.filter((prevCartao) => prevCartao.id !== cartao.id),
    )
  }

  useEffect(() => {
    async function fetchBandeiras() {
      try {
        const response = await api.get('card-brands')
        setBandeiras(response.data.cardBrands)
      } catch (err) {
        console.log(err)
      }
    }

    async function fetchCartoes() {
      try {
        const response = await api.get('cards')
        setCartoes(response.data.cards)
      } catch (err) {
        console.log(err)
      }
    }

    async function fetchInstituicoesFinanceiras() {
      try {
        const response = await api.get('financial-institutions')
        setInstituicoesFinanceiras(response.data.financialInstitutions)
      } catch (err) {
        console.log(err)
      }
    }

    fetchCartoes()
    fetchBandeiras()
    fetchInstituicoesFinanceiras()
  }, [])

  return (
    <>
      <Card
        headerTitle="Cartões"
        extraHeader={
          <Flex>
            <Button onClick={handleCreateCartao}>Cadastrar</Button>
          </Flex>
        }
      >
        <Table.ScrollArea borderWidth={1} borderColor="brand.text">
          <Table.Root
            variant="outline"
            showColumnBorder
            size="sm"
            color="brand.title"
          >
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader textAlign="center">ID</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">Nome</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Instituição Financeira
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Bandeira
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Taxa de Conversão
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Admin
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {cartoes?.map((cartao) => (
                <Table.Row key={cartao.id}>
                  <Table.Cell textAlign="center">{cartao.id}</Table.Cell>
                  <Table.Cell textAlign="center">{cartao.title}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {cartao.financial_institution_name}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {cartao.card_brand_name}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    {cartao.points_conversion_rate} ponto
                    {cartao.points_conversion_rate !== 1 && 's'} /{' '}
                    {getMoedaByCurrency(
                      cartao.points_currency,
                    ).toLocaleLowerCase()}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <HStack justify="center" align="center">
                      <IconButton
                        aria-label="Editar cartão"
                        size="xs"
                        className="dark"
                        variant="surface"
                        bgColor="brand.primary"
                        color="brand.title"
                        borderWidth={0}
                        ring="none"
                        _hover={{
                          filter: 'brightness(0.9)',
                          transition: 'filter 0.2s ease',
                        }}
                        onClick={() => handleUpdateCartao(cartao)}
                      >
                        <FaPencil />
                      </IconButton>
                      <IconButton
                        aria-label="Excluir cartão"
                        size="xs"
                        className="dark"
                        variant="surface"
                        bgColor="brand.danger"
                        color="brand.title"
                        borderWidth={0}
                        ring="none"
                        _hover={{
                          filter: 'brightness(0.9)',
                          transition: 'filter 0.2s ease',
                        }}
                        onClick={() => handleDeleteCartao(cartao)}
                      >
                        <FaTrash />
                      </IconButton>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Card>
      {createOrEditCartaoDisclosure.open &&
        bandeiras &&
        instituicoesFinanceiras && (
          <CreateOrEditCartaoModal
            disclosure={createOrEditCartaoDisclosure}
            onSave={onSaveCartao}
            selectedCartao={selectedCartao || undefined}
            bandeiras={bandeiras}
            instituicoesFinanceiras={instituicoesFinanceiras}
            moedas={moedas}
          />
        )}

      {deleteCartaoDisclosure.open && selectedCartao && (
        <DeleteCartaoModal
          disclosure={deleteCartaoDisclosure}
          onDelete={onDeleteCartao}
          selectedCartao={selectedCartao}
        />
      )}
    </>
  )
}
