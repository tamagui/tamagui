import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { TamaguiComponentStateRef } from '@tamagui/web'
import type { RefObject } from 'react'
import { getBoundingClientRect } from '../helpers/getBoundingClientRect'

const LayoutHandlers = new WeakMap<Element, Function>()
const resizeListeners = new Set<Function>()

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
  // node resize/move
  resizeObserver = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const onLayout = LayoutHandlers.get(target)
      if (typeof onLayout !== 'function') return
      measureElement(target as HTMLElement).then((event) => {
        onLayout(event)
      })
    }
  })

  // window resize
  if (typeof window.addEventListener === 'function') {
    let tm
    window.addEventListener('resize', () => {
      clearTimeout(tm)
      tm = setTimeout(() => {
        resizeListeners.forEach((cb) => cb())
      }, 4)
    })
  }
}

export const measureElement = async (target: HTMLElement): Promise<LayoutEvent> => {
  return new Promise((res) => {
    measureLayout(target, null, (x, y, width, height, left, top) => {
      res({
        nativeEvent: {
          layout: { x, y, width, height, left, top },
          target,
        },
        timeStamp: Date.now(),
      })
    })
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
  ref: RefObject<TamaguiComponentStateRef>,
  onLayout?: ((e: LayoutEvent) => void) | null
) {
  const node = ref.current?.host as Element

  // ensure always up to date so we can avoid re-running effect
  if (node && onLayout) {
    LayoutHandlers.set(node, onLayout)
  }

  useIsomorphicLayoutEffect(() => {
    if (!resizeObserver || !onLayout) return
    const node = ref.current?.host as Element
    if (!node) return

    // setup once
    LayoutHandlers.set(node, onLayout)

    const onResize = () => {
      measureElement(node as HTMLElement).then(onLayout)
    }

    resizeListeners.add(onResize)
    resizeObserver.observe(node)

    return () => {
      LayoutHandlers.delete(node)
      resizeListeners.delete(onResize)
      resizeObserver?.unobserve(node)
    }
  }, [ref, !!onLayout])
}
