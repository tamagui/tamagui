import * as React from 'react'
import { LayoutRectangle } from 'react-native'
import { isWeb } from '../platform'

export const useLayout = (props: { onLayout?: (rect: LayoutRectangle) => void } = {}) => {
  const [layout, setLayout] = React.useState<LayoutRectangle | null>(null)
  if (!isWeb) {
    return {
      layout,
      onLayout: setLayout,
    }
  }

  const ref = React.useRef<HTMLElement>(null)
  React.useLayoutEffect(() => {
    if (!ref.current) {
      return
    }
    const ro = new ResizeObserver(([first] = []) => {
      if (!first)
        return
      // setLayout(first.contentRect)
      setLayout((prev) => {
        let next
        if (!prev) {
          next = first.contentRect
        } else {
          const { x, y, width, height } = first.contentRect
          // don't set new layout state unless the layout has actually changed
          if (x !== prev.x || y !== prev.y || width !== prev.width || height !== prev.height) {
            next = { x, y, width, height }
          }
        }
        if (next) {
          props.onLayout?.(next)
        }
        return prev
      })
    })
    ro.observe(ref.current)
    //
    const next = {
      width: ref.current.clientWidth,
      height: ref.current.clientHeight,
    }
    setLayout(next as any)
    props.onLayout?.(next as any)
    return () => {
      ro.disconnect()
    }
  }, [ref.current])

  return {
    layout,
    ref,
  }
}
