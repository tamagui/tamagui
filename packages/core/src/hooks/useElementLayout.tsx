import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { RefObject } from 'react'
import { getBoundingClientRect } from '../helpers/getBoundingClientRect'

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

const cache = new WeakMap()

export const measureLayout = (
  node: HTMLElement,
  relativeTo: HTMLElement | null,
  callback: (
    x: number,
    y: number,
    width: number,
    height: number,
    left: number,
    top: number
  ) => void
) => {
  const relativeNode = relativeTo || node?.parentNode
  if (relativeNode instanceof HTMLElement) {
    const now = Date.now()
    cache.set(node, now)
    Promise.all([
      getBoundingClientRectAsync(node),
      getBoundingClientRectAsync(relativeNode),
    ]).then(([nodeDim, relativeNodeDim]) => {
      if (relativeNodeDim && nodeDim && cache.get(node) === now) {
        const { x, y, width, height, left, top } = getRelativeDimensions(
          nodeDim,
          relativeNodeDim
        )
        callback(x, y, width, height, left, top)
      }
    })
  }
}

const getRelativeDimensions = (a: DOMRectReadOnly, b: DOMRectReadOnly) => {
  const { height, left, top, width } = a
  const x = left - b.left
  const y = top - b.top
  return { x, y, width, height, left, top }
}

const getBoundingClientRectAsync = (
  element: HTMLElement
): Promise<DOMRectReadOnly | undefined> => {
  return new Promise((resolve) => {
    function fallbackToSync() {
      resolve(getBoundingClientRect(element))
    }
    const tm = setTimeout(fallbackToSync, 10)
    const observer = new IntersectionObserver(
      (entries, ob) => {
        clearTimeout(tm)
        ob.disconnect()
        resolve(entries[0]?.boundingClientRect)
      },
      {
        threshold: 0.0001,
      }
    )
    observer.observe(element)
  })
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
