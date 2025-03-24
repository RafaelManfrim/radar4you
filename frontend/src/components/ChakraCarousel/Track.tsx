import { Flex } from '@chakra-ui/react'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { motion, PanInfo, useAnimation, useMotionValue } from 'motion/react'

const MotionFlex = motion(Flex)

interface TrackProps {
  setTrackIsActive: Dispatch<SetStateAction<boolean>>
  setActiveItem: Dispatch<SetStateAction<number>>
  trackIsActive: boolean
  activeItem: number
  constraint: number
  multiplier: number
  itemWidth: number
  positions: number[]
  children: ReactNode
}

const transitionProps = {
  stiffness: 400,
  type: 'spring',
  damping: 60,
  mass: 3,
}

export function Track({
  setTrackIsActive,
  setActiveItem,
  trackIsActive,
  activeItem,
  constraint,
  multiplier,
  itemWidth,
  positions,
  children,
}: TrackProps) {
  const [dragStartPosition, setDragStartPosition] = useState(0)
  const controls = useAnimation()
  const x = useMotionValue(0)
  const node = useRef<HTMLDivElement | null>(null)

  const handleDragStart = () => setDragStartPosition(positions[activeItem])

  const handleDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const distance = info.offset.x
    const velocity = info.velocity.x * multiplier
    const direction = velocity < 0 || distance < 0 ? 1 : -1

    const extrapolatedPosition =
      dragStartPosition +
      (direction === 1
        ? Math.min(velocity, distance)
        : Math.max(velocity, distance))

    const closestPosition = positions.reduce((prev, curr) => {
      return Math.abs(curr - extrapolatedPosition) <
        Math.abs(prev - extrapolatedPosition)
        ? curr
        : prev
    }, 0)

    if (!(closestPosition < positions[positions.length - constraint])) {
      setActiveItem(positions.indexOf(closestPosition))
      controls.start({
        x: closestPosition,
        transition: {
          velocity: info.velocity.x,
          ...transitionProps,
        },
      })
    } else {
      setActiveItem(positions.length - constraint)
      controls.start({
        x: positions[positions.length - constraint],
        transition: {
          velocity: info.velocity.x,
          ...transitionProps,
        },
      })
    }
  }

  const handleResize = useCallback(
    () =>
      controls.start({
        x: positions[activeItem],
        transition: {
          ...transitionProps,
        },
      }),
    [activeItem, controls, positions],
  )

  const handleClick = useCallback(
    (event: MouseEvent) => {
      if (!node.current) return

      node.current.contains(event.target as Node)
        ? setTrackIsActive(true)
        : setTrackIsActive(false)
    },
    [setTrackIsActive],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (trackIsActive) {
        if (activeItem < positions.length - constraint) {
          if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
            event.preventDefault()
            setActiveItem((prev) => prev + 1)
          }
        }
        if (activeItem > positions.length - positions.length) {
          if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
            event.preventDefault()
            setActiveItem((prev) => prev - 1)
          }
        }
      }
    },
    [trackIsActive, setActiveItem, activeItem, constraint, positions.length],
  )

  useEffect(() => {
    handleResize()

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [handleClick, handleResize, handleKeyDown, positions])

  return (
    <>
      {itemWidth && (
        <Flex flexDir="column" ref={node} gap={5} alignItems="stretch">
          <MotionFlex
            dragConstraints={node}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            animate={controls}
            style={{ x }}
            drag="x"
            _active={{ cursor: 'grabbing' }}
            minWidth="min-content"
            flexWrap="nowrap"
            cursor="grab"
          >
            {children}
          </MotionFlex>
        </Flex>
      )}
    </>
  )
}
