import { useState, useCallback, useLayoutEffect } from 'react'

const debounce = <T extends unknown[]>(
  limit: number,
  callback: (...args: T) => number,
) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(callback, limit, ...args)
  }
}

function getDimensionObject(node: HTMLElement) {
  const rect = node.getBoundingClientRect()
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    x: rect.x,
    y: rect.y,
    right: rect.right,
    bottom: rect.bottom,
    toJSON: rect.toJSON,
  }
}

export function useBoundingRect(limit?: number) {
  const [dimensions, setDimensions] = useState<DOMRect>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    x: 0,
    y: 0,
    right: 0,
    bottom: 0,
    toJSON: () => '',
  })
  const [node, setNode] = useState<HTMLElement | null>(null)

  const ref = useCallback((node: HTMLElement | null) => {
    setNode(node)
  }, [])

  useLayoutEffect(() => {
    if (typeof window !== 'undefined' && node) {
      const measure = () =>
        window.requestAnimationFrame(() =>
          setDimensions(getDimensionObject(node)),
        )

      measure()

      const listener = debounce(limit || 100, measure)

      window.addEventListener('resize', listener)
      window.addEventListener('scroll', listener)
      return () => {
        window.removeEventListener('resize', listener)
        window.removeEventListener('scroll', listener)
      }
    }
  }, [node, limit])

  return [ref, dimensions, node] as const
}
