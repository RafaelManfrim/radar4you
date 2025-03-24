import { Flex } from '@chakra-ui/react'
import {
  Dispatch,
  KeyboardEvent,
  ReactNode,
  SetStateAction,
  useState,
} from 'react'

interface ItemProps {
  setTrackIsActive: Dispatch<SetStateAction<boolean>>
  setActiveItem: Dispatch<SetStateAction<number>>
  activeItem: number
  constraint: number
  itemWidth: number
  positions: number[]
  children: ReactNode
  index: number
  gap: number
}

export function Item({
  setTrackIsActive,
  setActiveItem,
  activeItem,
  constraint,
  itemWidth,
  positions,
  children,
  index,
  gap,
}: ItemProps) {
  const [userDidTab, setUserDidTab] = useState(false)

  const handleFocus = () => setTrackIsActive(true)

  const handleBlur = () => {
    userDidTab && index + 1 === positions.length && setTrackIsActive(false)
    setUserDidTab(false)
  }

  const handleKeyUp = (event: KeyboardEvent<HTMLDivElement>) =>
    event.key === 'Tab' &&
    !(activeItem === positions.length - constraint) &&
    setActiveItem(index)

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) =>
    event.key === 'Tab' && setUserDidTab(true)

  return (
    <Flex
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyUp={handleKeyUp}
      onKeyDown={handleKeyDown}
      w={`${itemWidth}px`}
      _notLast={{
        mr: `${gap}px`,
      }}
      py="4px"
    >
      {children}
    </Flex>
  )
}
