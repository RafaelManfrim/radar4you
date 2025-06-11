import { Box, Flex, Progress } from '@chakra-ui/react'
import { Dispatch, ReactNode, SetStateAction, useLayoutEffect } from 'react'

import { percentage } from '@/utils/percentage'
import { Button } from '../ui/button'
import { useBoundingRect } from '@/hooks/useBoundingRect'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

interface SliderProps {
  setTrackIsActive: Dispatch<SetStateAction<boolean>>
  initSliderWidth: (width: number) => void
  setActiveItem: Dispatch<SetStateAction<number>>
  activeItem: number
  constraint: number
  itemWidth: number
  positions: number[]
  children: ReactNode
  gap: number
}

export function Slider({
  setTrackIsActive,
  initSliderWidth,
  setActiveItem,
  activeItem,
  constraint,
  itemWidth,
  positions,
  children,
  gap,
}: SliderProps) {
  const [ref, dimensions] = useBoundingRect()

  useLayoutEffect(() => {
    if (dimensions?.width) {
      return initSliderWidth(Math.round(dimensions.width))
    }
  }, [dimensions, initSliderWidth])

  const handleFocus = () => setTrackIsActive(true)

  const handleDecrementClick = () => {
    setTrackIsActive(true)
    !(activeItem === positions.length - positions.length) &&
      setActiveItem((prev) => prev - 1)
  }

  const handleIncrementClick = () => {
    setTrackIsActive(true)
    !(activeItem === positions.length - constraint) &&
      setActiveItem((prev) => prev + 1)
  }

  return (
    <>
      <Box
        ref={ref}
        w={{ base: '100%', md: `calc(100% + ${gap}px)` }}
        ml={{ base: 0, md: `-${gap / 2}px` }}
        px={`${gap / 2}px`}
        position="relative"
        overflow="hidden"
        _before={{
          bgGradient: 'linear(to-r, base.d400, transparent)',
          position: 'absolute',
          w: `${gap / 2}px`,
          content: "''",
          zIndex: 1,
          h: '100%',
          left: 0,
          top: 0,
        }}
        _after={{
          bgGradient: 'linear(to-l, base.d400, transparent)',
          position: 'absolute',
          w: `${gap / 2}px`,
          content: "''",
          zIndex: 1,
          h: '100%',
          right: 0,
          top: 0,
        }}
      >
        {children}
      </Box>

      <Flex w={`${itemWidth}px`} mt={`${gap / 2}px`} mx="auto">
        <Button
          onClick={handleDecrementClick}
          onFocus={handleFocus}
          mr={`${gap / 3}px`}
          color="gray.200"
          // variant="link"
          minW={0}
          size="xs"
        >
          <FaChevronLeft
          // boxSize={9}
          />
        </Button>

        <Progress.Root
          value={percentage(activeItem, positions.length - constraint)}
          alignSelf="center"
          borderRadius="2px"
          bg="brand.background"
          flex={1}
          h="3px"
          // sx={{
          //   '> div': {
          //     backgroundColor: 'gray.400',
          //   },
          // }}
        >
          <Progress.Track bg="brand.text-transparent">
            <Progress.Range bg="brand.primary" />
          </Progress.Track>
          <Progress.Label />
          <Progress.ValueText />
        </Progress.Root>

        <Button
          onClick={handleIncrementClick}
          onFocus={handleFocus}
          ml={`${gap / 3}px`}
          color="gray.200"
          // variant="link"
          zIndex={2}
          minW={0}
          size="xs"
        >
          <FaChevronRight
          // boxSize={9}
          />
        </Button>
      </Flex>
    </>
  )
}
