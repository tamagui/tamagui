import { useRef, useState } from 'react'
import { LayoutChangeEvent, LayoutRectangle } from 'react-native'

import { isWeb, useIsomorphicLayoutEffect } from '../platform'
import { debounce } from './useDebounce'

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
    let hasUpdatedOnce = false
    let last: LayoutRectangle | null = null

    const getNext = (prev: LayoutRectangle | null, rect: LayoutRectangle) => {
      let next
      if (!prev) {
        next = rect
      }
      const width = Math.max(1, Math.round(rect.width))
      const height = Math.max(1, Math.round(rect.height))
      // don't set new layout state unless the layout has actually changed
      if (!prev || width !== prev.width || height !== prev.height) {
        next = { width, height }
      }
      if (next) {
        // prettier-ignore
        console.log('layout change', last?.width == next.width, last?.height == next.height, last, next)
        // @ts-expect-error
        props.onLayout?.({ nativeEvent: { layout: next } })
        last = next
        return next
      }
      return prev
    }

    const updateImmediate = (rect: LayoutRectangle) => {
      if (!props.stateless) {
        setLayout((p) => getNext(p, rect))
      } else {
        if (getNext(last, rect)) {
          // @ts-expect-error
          props.onLayout?.({ nativeEvent: { layout: next } })
        }
      }
    }

    const updateDbc = debounce(updateImmediate, 0, true)
    const update = (a) => {
      if (!a.width && !a.height) {
        return
      }
      // clearTimeout(tm)
      if (!hasUpdatedOnce) {
        hasUpdatedOnce = true
        updateImmediate(a)
        return
      }
      updateDbc(a)
    }

    const ro = new ResizeObserver(([{ contentRect }] = []) => {
      update(contentRect)
    })
    ro.observe(node)

    const io = new IntersectionObserver(([{ boundingClientRect }]) => {
      update(boundingClientRect)
    })
    io.observe(node)

    // let tm = setTimeout(() => {
    //   // if hasnt fired by now, send first one
    //   console.log(node)
    //   update(node.getBoundingClientRect())
    // })

    return () => {
      // clearTimeout(tm)
      updateDbc.cancel()
      ro.disconnect()
      io.disconnect()
    }
  }, [ref])

  return {
    layout,
    ref,
  }
}
