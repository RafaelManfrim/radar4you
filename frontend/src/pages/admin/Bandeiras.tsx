import { Card } from '@/components/Card'
import { CreateOrEditBandeiraModal } from '@/components/Modal/Bandeiras/CreateOrEditBandeiraModal'
import { DeleteBandeiraModal } from '@/components/Modal/Bandeiras/DeleteBandeiraModal'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'
import { Flex, HStack, Table, useDisclosure } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export interface Bandeira {
  id: string
  name: string
  logo_url: string
  created_at: string
  updated_at: string
}

export function Bandeiras() {
  const [bandeiras, setBandeiras] = useState<Bandeira[]>()
  const [selectedBandeira, setSelectedBandeira] = useState<Bandeira>()

  const createOrEditBandeiraDisclosure = useDisclosure()
  const deleteBandeiraDisclosure = useDisclosure()

  function handleCreateBandeira() {
    setSelectedBandeira(undefined)
    createOrEditBandeiraDisclosure.onOpen()
  }

  function handleUpdateBandeira(bandeira: Bandeira) {
    setSelectedBandeira(bandeira)
    createOrEditBandeiraDisclosure.onOpen()
  }

  function handleDeleteBandeira(bandeira: Bandeira) {
    setSelectedBandeira(bandeira)
    deleteBandeiraDisclosure.onOpen()
  }

  function onSaveBandeira(bandeira: Bandeira) {
    setSelectedBandeira(undefined)

    setBandeiras((prevBandeiras) => {
      if (prevBandeiras) {
        const bandeiraIndex = prevBandeiras.findIndex(
          (prevBandeira) => prevBandeira.id === bandeira.id,
        )

        if (bandeiraIndex !== -1) {
          prevBandeiras[bandeiraIndex] = bandeira
          return [...prevBandeiras]
        }

        return [...prevBandeiras, bandeira]
      }

      return [bandeira]
    })
  }

  function onDeleteBandeira(bandeira: Bandeira) {
    setSelectedBandeira(undefined)

    setBandeiras((prevBandeiras) =>
      prevBandeiras?.filter((prevBandeira) => prevBandeira.id !== bandeira.id),
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

    fetchBandeiras()
  }, [])

  return (
    <>
      <Card
        headerTitle="Bandeiras"
        extraHeader={
          <Flex>
            <Button onClick={handleCreateBandeira}>Cadastrar</Button>
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
                  Logo URL
                </Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  Admin
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {bandeiras?.map((bandeira) => (
                <Table.Row key={bandeira.id}>
                  <Table.Cell textAlign="center">{bandeira.id}</Table.Cell>
                  <Table.Cell textAlign="center">{bandeira.name}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {bandeira.logo_url}
                  </Table.Cell>
                  <Table.Cell textAlign="center">
                    <HStack justify="center" align="center">
                      <Button
                        onClick={() => handleUpdateBandeira(bandeira)}
                        size="sm"
                      >
                        Editar
                      </Button>
                      <Button
                        onClick={() => handleDeleteBandeira(bandeira)}
                        size="sm"
                      >
                        Excluir
                      </Button>
                    </HStack>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Table.ScrollArea>
      </Card>
      {createOrEditBandeiraDisclosure.open && (
        <CreateOrEditBandeiraModal
          disclosure={createOrEditBandeiraDisclosure}
          onSave={onSaveBandeira}
          selectedBandeira={selectedBandeira || undefined}
        />
      )}

      {deleteBandeiraDisclosure.open && selectedBandeira && (
        <DeleteBandeiraModal
          disclosure={deleteBandeiraDisclosure}
          onDelete={onDeleteBandeira}
          selectedBandeira={selectedBandeira}
        />
      )}
    </>
  )
}
