import { Card } from '@/components/Card'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'
import { Flex, HStack, Table } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

interface Bandeira {
  id: string
  name: string
  logo_url: string
  created_at: string
  updated_at: string
}

export function Bandeiras() {
  const [bandeiras, setBandeiras] = useState<Bandeira[]>()

  useEffect(() => {
    async function fetchBandeiras() {
      try {
        const response = await api.get('cards/brands')
        setBandeiras(response.data.cardBrands)
      } catch (err) {
        console.log(err)
      }
    }

    fetchBandeiras()
  }, [])

  return (
    <Card
      headerTitle="Bandeiras"
      extraHeader={
        <Flex>
          <Button>Cadastrar</Button>
        </Flex>
      }
    >
      <Table.Root variant="outline" showColumnBorder size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader textAlign="center">ID</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">Nome</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">Logo URL</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="center">Admin</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {bandeiras?.map((bandeira) => (
            <Table.Row key={bandeira.id}>
              <Table.Cell textAlign="center">{bandeira.id}</Table.Cell>
              <Table.Cell textAlign="center">{bandeira.name}</Table.Cell>
              <Table.Cell textAlign="center">{bandeira.logo_url}</Table.Cell>
              <Table.Cell textAlign="center">
                <HStack justify="center" align="center">
                  <Button>Editar</Button>
                  <Button>Excluir</Button>
                </HStack>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  )
}
