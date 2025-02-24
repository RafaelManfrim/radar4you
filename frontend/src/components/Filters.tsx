import { Stack } from '@chakra-ui/react'
import { Checkbox } from './ui/checkbox'
import { CheckedChangeDetails } from 'node_modules/@chakra-ui/react/dist/types/components/checkbox/namespace'

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

export function Filters({
  title,
  values,
  onRootClick,
  onItemClick,
}: FiltersProps) {
  const allChecked = values.every((value) => value.checked)
  const indeterminate = values.some((value) => value.checked) && !allChecked

  return (
    <Stack align="flex-start">
      <Checkbox
        cursor="pointer"
        checked={indeterminate ? 'indeterminate' : allChecked}
        colorPalette="purple"
        onCheckedChange={(e) => onRootClick(e)}
      >
        {title}
      </Checkbox>
      {values.map((item, index) => (
        <Checkbox
          colorPalette="purple"
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
