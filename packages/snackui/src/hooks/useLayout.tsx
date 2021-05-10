import { useRef, useState } from 'react'
import { LayoutRectangle } from 'react-native'

import { isWeb, useIsomorphicLayoutEffect } from '../platform'
import { debounce } from './useDebounce'

export const useLayout = (props: { onLayout?: (rect: LayoutRectangle) => void } = {}) => {
  const [layout, setLayout] = useState<LayoutRectangle | null>(null)
  if (!isWeb) {
    return {
      layout,
      onLayout: setLayout,
    }
  }

  const ref = useRef<HTMLElement>(null)

  const s = useRef(false)
  useIsomorphicLayoutEffect(() => {
    if (!ref.current) return
    if (!s.current) s.current = true
    else {
      console.log('re-run effect')
    }

    const update = debounce(
      (rect) => {
        setLayout((prev) => {
          let next
          if (!prev) {
            next = rect
          } else {
            const width = Math.round(rect.width)
            const height = Math.round(rect.height)
            // don't set new layout state unless the layout has actually changed
            if (width !== prev.width || height !== prev.height) {
              next = { width, height }
            }
          }
          if (next) {
            console.log('set layout')
            props.onLayout?.(next)
            return next
          }
          return prev
        })
      },
      0,
      true
    )

    const ro = new ResizeObserver(([{ contentRect }] = []) => {
      update(contentRect)
    })
    ro.observe(ref.current)

    const io = new IntersectionObserver(([{ boundingClientRect }]) => {
      update(boundingClientRect)
    })
    io.observe(ref.current)

    return () => {
      update.cancel()
      ro.disconnect()
      io.disconnect()
    }
  }, [ref])

  return {
    layout,
    ref,
  }
}
