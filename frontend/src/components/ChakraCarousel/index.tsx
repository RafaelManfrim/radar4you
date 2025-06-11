import { useCallback, useEffect, useState, useMemo, ReactNode } from 'react'
import { Box, BoxProps, useMediaQuery } from '@chakra-ui/react'

import { system } from '@/styles/theme'
import { Item } from './Item'
import { Track } from './Track'
import { Slider } from './Slider'

interface ChakraCarouselProps extends BoxProps {
  children: ReactNode[]
  gap: number
}

export function ChakraCarousel({
  children,
  gap,
  ...rest
}: ChakraCarouselProps) {
  const [trackIsActive, setTrackIsActive] = useState(false)
  const [multiplier, setMultiplier] = useState(0.35)
  const [sliderWidth, setSliderWidth] = useState(0)
  const [activeItem, setActiveItem] = useState(0)
  const [constraint, setConstraint] = useState(0)
  const [itemWidth, setItemWidth] = useState(0)

  const initSliderWidth = useCallback(
    (width: number) => setSliderWidth(width),
    [],
  )

  const positions = useMemo(
    () => children.map((_, index) => -Math.abs((itemWidth + gap) * index)),
    [children, itemWidth, gap],
  )

  const [breakpointSM, breakpointMD, breakpointLG] = system.breakpoints.values

  const [isBetweenBaseAndMd, isBetweenMdAndXl, isGreaterThanXL] = useMediaQuery(
    [
      `(min-width: ${breakpointSM.min}) and (max-width: ${breakpointMD.max})`,
      `(min-width: ${breakpointMD.max}) and (max-width: ${breakpointLG.max})`,
      `(min-width: ${breakpointLG.max})`,
    ],
    {
      fallback: [false, false, false],
    },
  )

  useEffect(() => {
    if (isBetweenBaseAndMd) {
      setItemWidth(sliderWidth - gap)
      setMultiplier(0.65)
      setConstraint(1)
    }
    if (isBetweenMdAndXl) {
      setItemWidth(sliderWidth / 2 - gap)
      setMultiplier(0.5)
      setConstraint(2)
    }
    if (isGreaterThanXL) {
      setItemWidth(sliderWidth / 3 - gap)
      setMultiplier(0.35)
      setConstraint(3)
    }
  }, [isBetweenBaseAndMd, isBetweenMdAndXl, isGreaterThanXL, sliderWidth, gap])

  const sliderProps = {
    setTrackIsActive,
    initSliderWidth,
    setActiveItem,
    activeItem,
    constraint,
    itemWidth,
    positions,
    gap,
  }

  const trackProps = {
    setTrackIsActive,
    trackIsActive,
    setActiveItem,
    sliderWidth,
    activeItem,
    constraint,
    multiplier,
    itemWidth,
    positions,
    gap,
  }

  const itemProps = {
    setTrackIsActive,
    trackIsActive,
    setActiveItem,
    activeItem,
    constraint,
    itemWidth,
    positions,
    gap,
  }

  return (
    <Box w="full" {...rest}>
      <Slider {...sliderProps}>
        <Track {...trackProps}>
          {children.map((child, index) => (
            <Item {...itemProps} index={index} key={index}>
              {child}
            </Item>
          ))}
        </Track>
      </Slider>
    </Box>
  )
}
