import { isClient, useIsomorphicLayoutEffect } from '@tamagui/constants'
import {
  isEqualShallow,
  type TamaguiComponentStateRef,
  ___onDidFinishClientRender,
} from '@tamagui/web'
import type { RefObject } from 'react'

const LayoutHandlers = new WeakMap<HTMLElement, Function>()
const Nodes = new Set<HTMLElement>()

type LayoutMeasurementStatus = 'inactive' | 'active'

let status: LayoutMeasurementStatus = 'active'
export function setOnLayoutStrategy(state: LayoutMeasurementStatus) {
  status = state
}

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

const NodeRectCache = new WeakMap<HTMLElement, DOMRect>()
const ParentRectCache = new WeakMap<HTMLElement, DOMRect>()

const rAF = typeof window !== 'undefined' ? window.requestAnimationFrame : undefined

if (isClient) {
  if (rAF) {
    // prevent thrashing during first hydration (somewhat, streaming gets trickier)
    let avoidUpdates = true
    const queuedUpdates = new Map<HTMLElement, Function>()

    ___onDidFinishClientRender(() => {
      avoidUpdates = false
      if (queuedUpdates) {
        queuedUpdates.forEach((cb) => cb())
        queuedUpdates.clear()
      }
    })

    function updateLayoutIfChanged(node: HTMLElement) {
      const nodeRect = node.getBoundingClientRect()
      const parentNode = node.parentElement
      const parentRect = parentNode?.getBoundingClientRect()

      const onLayout = LayoutHandlers.get(node)
      if (typeof onLayout !== 'function') return

      const cachedRect = NodeRectCache.get(node)
      const cachedParentRect = parentNode ? NodeRectCache.get(parentNode) : null

      if (
        !cachedRect ||
        // has changed one rect
        (!isEqualShallow(cachedRect, nodeRect) &&
          (!cachedParentRect || !isEqualShallow(cachedParentRect, parentRect)))
      ) {
        NodeRectCache.set(node, nodeRect)
        if (parentRect && parentNode) {
          ParentRectCache.set(parentNode, parentRect)
        }
        const event = getElementLayoutEvent(node)
        if (avoidUpdates) {
          queuedUpdates.set(node, () => onLayout(event))
        } else {
          onLayout(event)
        }
      }
    }

    // note that getBoundingClientRect() does not thrash layout if its after an animation frame
    rAF!(layoutOnAnimationFrame)
    function layoutOnAnimationFrame() {
      if (status !== 'inactive') {
        Nodes.forEach(updateLayoutIfChanged)
      }
      rAF!(layoutOnAnimationFrame)
    }
  } else {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        `No requestAnimationFrame - please polyfill for onLayout to work correctly`
      )
    }
  }
}

export const getElementLayoutEvent = (target: HTMLElement): LayoutEvent => {
  let res: LayoutEvent | null = null
  measureLayout(target, null, (x, y, width, height, left, top) => {
    res = {
      nativeEvent: {
        layout: { x, y, width, height, left, top },
        target,
      },
      timeStamp: Date.now(),
    }
  })
  if (!res) {
    throw new Error(`‼️`) // impossible
  }
  return res
}

// matching old RN callback API (can we remove?)
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
  const relativeNode = relativeTo || node?.parentElement
  if (relativeNode instanceof HTMLElement) {
    const nodeDim = node.getBoundingClientRect()
    const relativeNodeDim = relativeNode.getBoundingClientRect()
    if (relativeNodeDim && nodeDim) {
      const { x, y, width, height, left, top } = getRelativeDimensions(
        nodeDim,
        relativeNodeDim
      )
      callback(x, y, width, height, left, top)
    }
  }
}

const getRelativeDimensions = (a: DOMRectReadOnly, b: DOMRectReadOnly) => {
  const { height, left, top, width } = a
  const x = left - b.left
  const y = top - b.top
  return { x, y, width, height, left, top }
}

export function useElementLayout(
  ref: RefObject<TamaguiComponentStateRef>,
  onLayout?: ((e: LayoutEvent) => void) | null
) {
  // ensure always up to date so we can avoid re-running effect
  const node = ref.current?.host as HTMLElement
  if (node && onLayout) {
    LayoutHandlers.set(node, onLayout)
  }

  useIsomorphicLayoutEffect(() => {
    if (!onLayout) return
    const node = ref.current?.host as HTMLElement
    if (!node) return

    LayoutHandlers.set(node, onLayout)
    Nodes.add(node)
    onLayout(getElementLayoutEvent(node))

    return () => {
      Nodes.delete(node)
      LayoutHandlers.delete(node)
      NodeRectCache.delete(node)
    }
  }, [ref, !!onLayout])
}
