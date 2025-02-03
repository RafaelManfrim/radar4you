import { Card } from '@/components/Card'
import { CreateOrEditInstituicaoFinanceiraModal } from '@/components/Modal/InstituicoesFinanceiras/CreateOrEditInstituicaoFinanceiraModal'
import { DeleteInstituicaoFinanceiraModal } from '@/components/Modal/InstituicoesFinanceiras/DeleteInstituicaoFinanceiraModal'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'
import { Flex, HStack, Table, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export interface InstituicaoFinanceira {
  id: string
  name: string
  logo_url: string
  created_at: string
  updated_at: string
}

export function InstituicoesFinanceiras() {
  const [instituicoesFinanceiras, setInstituicoesFinanceiras] =
    useState<InstituicaoFinanceira[]>()
  const [selectedInstituicaoFinanceira, setSelectedInstituicaoFinanceira] =
    useState<InstituicaoFinanceira>()

  const createOrEditInstituicaoFinanceiraDisclosure = useDisclosure()
  const deleteInstituicaoFinanceiraDisclosure = useDisclosure()

  function handleCreateInstituicaoFinanceira() {
    setSelectedInstituicaoFinanceira(undefined)
    createOrEditInstituicaoFinanceiraDisclosure.onOpen()
  }

  function handleUpdateInstituicaoFinanceira(
    instituicaoFinanceira: InstituicaoFinanceira,
  ) {
    setSelectedInstituicaoFinanceira(instituicaoFinanceira)
    createOrEditInstituicaoFinanceiraDisclosure.onOpen()
  }

  function handleDeleteInstituicaoFinanceira(
    instituicaoFinanceira: InstituicaoFinanceira,
  ) {
    setSelectedInstituicaoFinanceira(instituicaoFinanceira)
    deleteInstituicaoFinanceiraDisclosure.onOpen()
  }

  function onSaveInstituicaoFinanceira(
    instituicaoFinanceira: InstituicaoFinanceira,
  ) {
    setSelectedInstituicaoFinanceira(undefined)

    setInstituicoesFinanceiras((prevInstituicoesFinanceiras) => {
      if (prevInstituicoesFinanceiras) {
        const instituicaoFinanceiraIndex =
          prevInstituicoesFinanceiras.findIndex(
            (prevBandeira) => prevBandeira.id === instituicaoFinanceira.id,
          )

        if (instituicaoFinanceiraIndex !== -1) {
          prevInstituicoesFinanceiras[instituicaoFinanceiraIndex] =
            instituicaoFinanceira
          return [...prevInstituicoesFinanceiras]
        }

        return [...prevInstituicoesFinanceiras, instituicaoFinanceira]
      }

      return [instituicaoFinanceira]
    })
  }

  function onDeleteInstituicaoFinanceira(
    instituicaoFinanceira: InstituicaoFinanceira,
  ) {
    setSelectedInstituicaoFinanceira(undefined)

    setInstituicoesFinanceiras((prevInstituicoesFinanceiras) =>
      prevInstituicoesFinanceiras?.filter(
        (prevBandeira) => prevBandeira.id !== instituicaoFinanceira.id,
      ),
    )
  }

  useEffect(() => {
    async function fetchInstituicoesFinanceiras() {
      try {
        const response = await api.get('financial-institutions')
        setInstituicoesFinanceiras(response.data.financialInstitutions)
      } catch (err) {
        console.log(err)
      }
    }

    fetchInstituicoesFinanceiras()
  }, [])

  return (
    <>
      <Card
        headerTitle="Instituições Financeiras"
        extraHeader={
          <Flex>
            <Button onClick={handleCreateInstituicaoFinanceira}>
              Cadastrar
            </Button>
          </Flex>
        }
      >
        <Table.Root variant="outline" showColumnBorder size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader textAlign="center">ID</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Nome</Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">
                Logo URL
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="center">Admin</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {instituicoesFinanceiras?.map((instituicaoFinanceira) => (
              <Table.Row key={instituicaoFinanceira.id}>
                <Table.Cell textAlign="center">
                  {instituicaoFinanceira.id}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {instituicaoFinanceira.name}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  {instituicaoFinanceira.logo_url}
                </Table.Cell>
                <Table.Cell textAlign="center">
                  <HStack justify="center" align="center">
                    <Button
                      onClick={() =>
                        handleUpdateInstituicaoFinanceira(instituicaoFinanceira)
                      }
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() =>
                        handleDeleteInstituicaoFinanceira(instituicaoFinanceira)
                      }
                    >
                      Excluir
                    </Button>
                  </HStack>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Card>
      {createOrEditInstituicaoFinanceiraDisclosure.open && (
        <CreateOrEditInstituicaoFinanceiraModal
          disclosure={createOrEditInstituicaoFinanceiraDisclosure}
          onSave={onSaveInstituicaoFinanceira}
          selectedInstituicaoFinanceira={
            selectedInstituicaoFinanceira || undefined
          }
        />
      )}

      {deleteInstituicaoFinanceiraDisclosure.open &&
        selectedInstituicaoFinanceira && (
          <DeleteInstituicaoFinanceiraModal
            disclosure={deleteInstituicaoFinanceiraDisclosure}
            onDelete={onDeleteInstituicaoFinanceira}
            selectedInstituicaoFinanceira={selectedInstituicaoFinanceira}
          />
        )}
    </>
  )
}
