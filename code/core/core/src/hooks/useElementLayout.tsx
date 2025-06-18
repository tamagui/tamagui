import { isClient, useIsomorphicLayoutEffect } from '@tamagui/constants'
import {
  isEqualShallow,
  type TamaguiComponentStateRef,
  ___onDidFinishClientRender,
} from '@tamagui/web'
import type { RefObject } from 'react'

const LayoutHandlers = new WeakMap<HTMLElement, Function>()
const Nodes = new Set<HTMLElement>()

type LayoutMeasurementStrategy = 'off' | 'sync' | 'async'

let strategy: LayoutMeasurementStrategy = 'async'

export function setOnLayoutStrategy(state: LayoutMeasurementStrategy) {
  strategy = state
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
const DebounceTimers = new WeakMap<HTMLElement, NodeJS.Timeout>()
const LastChangeTime = new WeakMap<HTMLElement, number>()

const rAF = typeof window !== 'undefined' ? window.requestAnimationFrame : undefined
const DEBOUNCE_DELAY = 32 // 32ms debounce (2 frames at 60fps)

if (isClient) {
  if (rAF) {
    // prevent thrashing during first hydration (somewhat, streaming gets trickier)
    let avoidUpdates = true
    const queuedUpdates = new Map<HTMLElement, Function>()

    // track frame timing to detect sync work and avoid updates during heavy periods
    let lastFrameAt = Date.now()
    const numDroppedFramesUntilPause = 2 // adjust sensitivity

    ___onDidFinishClientRender(() => {
      avoidUpdates = false
      if (queuedUpdates) {
        queuedUpdates.forEach((cb) => cb())
        queuedUpdates.clear()
      }
    })

    async function updateLayoutIfChanged(node: HTMLElement) {
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

        if (avoidUpdates) {
          // Use sync version for queued updates to avoid promise complications
          const event = getElementLayoutEvent(node)
          queuedUpdates.set(node, () => onLayout(event))
        } else if (strategy === 'async') {
          // For async strategy, debounce the layout update
          const now = Date.now()
          LastChangeTime.set(node, now)

          // Clear existing debounce timer
          const existingTimer = DebounceTimers.get(node)
          if (existingTimer) {
            clearTimeout(existingTimer)
          }

          // Set new debounce timer
          const timer = setTimeout(async () => {
            const lastChange = LastChangeTime.get(node) || 0
            const timeSinceChange = Date.now() - lastChange

            // Only fire if at least DEBOUNCE_DELAY has passed since last change
            if (timeSinceChange >= DEBOUNCE_DELAY) {
              const event = await getElementLayoutEventAsync(node)
              onLayout(event)
              DebounceTimers.delete(node)
            } else {
              // Reschedule if not enough time has passed
              const remainingDelay = DEBOUNCE_DELAY - timeSinceChange
              const newTimer = setTimeout(async () => {
                const event = await getElementLayoutEventAsync(node)
                onLayout(event)
                DebounceTimers.delete(node)
              }, remainingDelay)
              DebounceTimers.set(node, newTimer)
            }
          }, DEBOUNCE_DELAY)

          DebounceTimers.set(node, timer)
        } else {
          // Sync strategy - use sync version
          const event = getElementLayoutEvent(node)
          onLayout(event)
        }
      }
    }

    // note that getBoundingClientRect() does not thrash layout if its after an animation frame
    rAF!(layoutOnAnimationFrame)
    function layoutOnAnimationFrame() {
      const now = Date.now()
      const timeSinceLastFrame = now - lastFrameAt
      lastFrameAt = now

      if (strategy !== 'off') {
        // avoid updates if we've been dropping frames (indicates sync work happening)
        const expectedFrameTime = 16.67 // ~60fps
        const hasRecentSyncWork =
          timeSinceLastFrame > expectedFrameTime * numDroppedFramesUntilPause

        if (!hasRecentSyncWork) {
          Nodes.forEach(updateLayoutIfChanged)
        }
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

// Sync versions
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

export const getElementLayoutEventAsync = async (
  target: HTMLElement
): Promise<LayoutEvent> => {
  let res: LayoutEvent | null = null
  await measureLayoutAsync(target, null, (x, y, width, height, left, top) => {
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

export const measureLayoutAsync = async (
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
    const [nodeDim, relativeNodeDim] = await Promise.all([
      node.getBoundingClientRect(),
      relativeNode.getBoundingClientRect(),
    ])

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

      // Clean up debounce timer and tracking
      const timer = DebounceTimers.get(node)
      if (timer) {
        clearTimeout(timer)
        DebounceTimers.delete(node)
      }
      LastChangeTime.delete(node)
    }
  }, [ref, !!onLayout])
}
