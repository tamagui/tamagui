import { MutableRefObject, RefObject, useLayoutEffect } from 'react'

const DOM_LAYOUT_HANDLER_NAME = '__reactLayoutHandler'

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

if (typeof window.ResizeObserver !== 'undefined') {
  resizeObserver = new ResizeObserver((entries) => {
    for (const { target } of entries) {
      const onLayout = target[DOM_LAYOUT_HANDLER_NAME]
      if (typeof onLayout !== 'function') return
      measureLayout(target as HTMLElement, (layout) => {
        onLayout({
          nativeEvent: {
            layout,
            target,
          },
          timeStamp: Date.now(),
        })
      })
    }
  })

  const getBoundingClientRect = (node: HTMLElement | null): void | DOMRect => {
    if (!node) return
    if (node.nodeType !== 1) return
    if (typeof node.getBoundingClientRect !== 'function') return
    return node.getBoundingClientRect()
  }

  const getRect = (node: HTMLElement) => {
    const rect = getBoundingClientRect(node)
    if (!rect) return
    const { x, y, top, left } = rect
    return { x, y, width: node.offsetWidth, height: node.offsetHeight, top, left }
  }

  const measureLayout = (node: HTMLElement, callback: Function) => {
    const relativeNode = node?.parentNode
    if (relativeNode instanceof HTMLElement) {
      setTimeout(() => {
        const relativeRect = getBoundingClientRect(relativeNode)!
        const { height, left, top, width } = getRect(node)!
        const x = left - relativeRect.left
        const y = top - relativeRect.top
        callback({ x, y, width, height, left, top })
      }, 0)
    }
  }
}

export function useElementLayout(
  ref: RefObject<Element>,
  onLayout?: ((e: LayoutEvent) => void) | null
) {
  const node = ref.current
  if (node) {
    node[DOM_LAYOUT_HANDLER_NAME] = onLayout
  }

  // Observing is done in a separate effect to avoid this effect running
  // when 'onLayout' changes.
  useLayoutEffect(() => {
    if (!resizeObserver) return
    const node = ref.current
    if (!node) return
    if (typeof node[DOM_LAYOUT_HANDLER_NAME] === 'function') {
      resizeObserver.observe(node)
    } else {
      resizeObserver.unobserve(node)
    }
    return () => {
      resizeObserver?.unobserve(node)
    }
  }, [ref])
}
