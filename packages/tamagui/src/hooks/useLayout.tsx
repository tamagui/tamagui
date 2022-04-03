import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/core'
import { useRef, useState } from 'react'
import { LayoutChangeEvent, LayoutRectangle } from 'react-native'

// TODO move to core and make it able to be run as feature (check this is same as rnw useLayout)

export const useLayout = (
  props: { stateless?: boolean; onLayout?: (rect: LayoutChangeEvent) => void } = {}
) => {
  const [layout, setLayout] = useState<LayoutRectangle | null>(null)

  if (!isWeb) {
    return {
      layout,
      onLayout: props.onLayout,
    }
  }

  const ref = useRef<any>(null)

  useIsomorphicLayoutEffect(() => {
    const node = ref.current
    if (!node) return
    // let hasUpdatedOnce = false
    let last: LayoutRectangle | null = null

    const getNextAndCallback = (rect: LayoutRectangle) => {
      let next
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))
      // don't set new layout state unless the layout has actually changed
      if (!last || width !== last.width || height !== last.height) {
        next = { width, height }
      }
      if (next) {
        // @ts-expect-error
        props.onLayout?.({ nativeEvent: { layout: next } })
        last = next
        return next
      }
      return last
    }

    const update = (rect: LayoutRectangle) => {
      if (props.stateless) {
        getNextAndCallback(rect)
      } else {
        setLayout((p) => getNextAndCallback(rect))
      }
    }

    const ro = new ResizeObserver(([{ contentRect }] = []) => {
      update(contentRect)
    })
    ro.observe(node)

    return () => {
      ro.disconnect()
    }
  }, [ref])

  return {
    layout,
    ref,
  }
}
