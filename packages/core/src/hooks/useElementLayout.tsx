import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { RefObject } from 'react'

import { getBoundingClientRect } from '../helpers/getBoundingClientRect'
import { getRect } from '../helpers/getRect'

const LayoutHandlers = new WeakMap<Element, Function>()
const LayoutTimeouts = new WeakMap<Element, any>()

export type LayoutValue = {
  x: number
  y: number
  width: number
  height: number
  left: number
  top: number
}

export type LayoutEvent = {
  nativeEvent: {
    layout: LayoutValue
    target: any
  }
  timeStamp: number
}

let resizeObserver: ResizeObserver | null = null

if (typeof window !== 'undefined' && 'ResizeObserver' in window) {
  resizeObserver = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const onLayout = LayoutHandlers.get(target)
      if (typeof onLayout !== 'function') return
      measureLayout(target as HTMLElement, null, (x, y, width, height, left, top) => {
        onLayout({
          nativeEvent: {
            layout: { x, y, width, height, left, top },
            target,
          },
          timeStamp: Date.now(),
        })
      })
    }
  })
}

export const measureLayout = (
  node: HTMLElement,
  relativeTo: HTMLElement | null,
  callback: Function
) => {
  const relativeNode = relativeTo || node?.parentNode
  if (relativeNode instanceof HTMLElement) {
    // avoid double onLayout
    clearTimeout(LayoutTimeouts.get(relativeNode))
    // according to react-native-web https://github.com/necolas/react-native-web/commit/b4e3427fea9bd943e3b3be13def0f4ffb3df917c
    const tm = setTimeout(() => {
      const relativeRect = getBoundingClientRect(relativeNode)!
      const { height, left, top, width } = getRect(node)!
      const x = left - relativeRect.left
      const y = top - relativeRect.top
      callback(x, y, width, height, left, top)
      LayoutTimeouts.delete(relativeNode)
    }, 0)
    LayoutTimeouts.set(relativeNode, tm)
  }
}

export function useElementLayout(
  ref: RefObject<Element>,
  onLayout?: ((e: LayoutEvent) => void) | null
) {
  useIsomorphicLayoutEffect(() => {
    if (!resizeObserver || !onLayout) return
    const node = ref.current
    if (!node) return
    LayoutHandlers.set(node, onLayout)
    resizeObserver.observe(node)
    return () => {
      resizeObserver?.unobserve(node)
    }
  }, [ref, onLayout])
}
