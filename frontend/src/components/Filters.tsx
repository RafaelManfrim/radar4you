import { Flex, IconButton, Stack } from '@chakra-ui/react'
import { Checkbox } from './ui/checkbox'
import { CheckedChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/checkbox/namespace'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import { useState } from 'react'

export type FilterValue = {
  label: string
  checked: boolean
  value: string
}

interface FiltersProps {
  title: string
  values: FilterValue[]
  onRootClick: (e: CheckedChangeDetails) => void
  onItemClick: (e: CheckedChangeDetails, index: number) => void
}

const filtersStates = {
  minimized: 'minimized',
  maximized: 'maximized',
}

export function Filters({
  title,
  values,
  onRootClick,
  onItemClick,
}: FiltersProps) {
  const [filtersState, setFiltersState] = useState('minimized')

  const allChecked = values.every((value) => value.checked)
  const indeterminate = values.some((value) => value.checked) && !allChecked

  function handleMinimize() {
    setFiltersState((prevState) =>
      prevState === filtersStates.maximized
        ? filtersStates.minimized
        : filtersStates.maximized,
    )
  }

  function handleMaximize() {
    setFiltersState((prevState) =>
      prevState === filtersStates.minimized
        ? filtersStates.maximized
        : filtersStates.minimized,
    )
  }

  return (
    <Stack align="flex-start" w="full">
      <Flex justify="space-between" w="full">
        <Checkbox
          cursor="pointer"
          checked={indeterminate ? 'indeterminate' : allChecked}
          colorPalette="brand"
          onCheckedChange={(e) => onRootClick(e)}
        >
          {title}
        </Checkbox>
        {filtersState === filtersStates.maximized && (
          <IconButton
            aria-label="Minimizar filtros"
            size="2xs"
            className="dark"
            variant="ghost"
            color="brand.text"
            borderWidth={0}
            ring="none"
            _hover={{
              color: 'brand.title',
              bgColor: 'transparent',
              filter: 'brightness(0.9)',
              transition: 'filter 0.2s ease',
            }}
            onClick={handleMinimize}
          >
            <FaChevronUp />
          </IconButton>
        )}
        {filtersState === filtersStates.minimized && (
          <IconButton
            aria-label="Maximizar filtros"
            size="2xs"
            className="dark"
            variant="ghost"
            color="brand.text"
            borderWidth={0}
            ring="none"
            _hover={{
              color: 'brand.title',
              bgColor: 'transparent',
              filter: 'brightness(0.9)',
              transition: 'filter 0.2s ease',
            }}
            onClick={handleMaximize}
          >
            <FaChevronDown />
          </IconButton>
        )}
      </Flex>
      {filtersState === filtersStates.maximized &&
        values.map((item, index) => (
          <Checkbox
            colorPalette="brand"
            cursor="pointer"
            ms="6"
            key={item.value}
            checked={item.checked}
            onCheckedChange={(e) => onItemClick(e, index)}
          >
            {item.label}
          </Checkbox>
        ))}
    </Stack>
  )
}
