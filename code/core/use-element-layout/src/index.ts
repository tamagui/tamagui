import { isClient, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { isEqualShallow } from '@tamagui/is-equal-shallow'
import type { RefObject } from 'react'

const LayoutHandlers = new WeakMap<HTMLElement, Function>()
const Nodes = new Set<HTMLElement>()
const IntersectionState = new WeakMap<HTMLElement, boolean>()

// Single persistent IntersectionObserver for all nodes
let globalIntersectionObserver: IntersectionObserver | null = null

type TamaguiComponentStatePartial = {
  host?: any
}

type LayoutMeasurementStrategy = 'off' | 'sync' | 'async'

let strategy: LayoutMeasurementStrategy = 'async'

export function setOnLayoutStrategy(state: LayoutMeasurementStrategy): void {
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
const LastChangeTime = new WeakMap<HTMLElement, number>()

const rAF = typeof window !== 'undefined' ? window.requestAnimationFrame : undefined

// prevent thrashing during first hydration (somewhat, streaming gets trickier)
let avoidUpdates = true
const queuedUpdates = new Map<HTMLElement, Function>()

export function enable(): void {
  if (avoidUpdates) {
    avoidUpdates = false
    if (queuedUpdates) {
      queuedUpdates.forEach((cb) => cb())
      queuedUpdates.clear()
    }
  }
}

const expectedFrameTime = 16.67 // ~60fps
const numDroppedFramesUntilPause = 10

function startGlobalIntersectionObserver() {
  if (!isClient || globalIntersectionObserver) return

  globalIntersectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const node = entry.target as HTMLElement
        if (IntersectionState.get(node) !== entry.isIntersecting) {
          IntersectionState.set(node, entry.isIntersecting)
        }
      })
    },
    {
      threshold: 0,
    }
  )
}

if (isClient) {
  if (rAF) {
    const supportsCheckVisibility = 'checkVisibility' in document.body
    // track frame timing to detect sync work and avoid updates during heavy periods
    let lastFrameAt = Date.now()

    async function updateLayoutIfChanged(node: HTMLElement, frameId: number) {
      if (IntersectionState.get(node) === false) {
        // avoid due to not intersecting
        return
      }
      // triggers style recalculation in safari which is slower than not
      if (process.env.TAMAGUI_ONLAYOUT_VISIBILITY_CHECK === '1') {
        if (supportsCheckVisibility && !(node as any).checkVisibility()) {
          // avoid due to not visible
          return
        }
      }

      const onLayout = LayoutHandlers.get(node)
      if (typeof onLayout !== 'function') return

      const parentNode = node.parentElement
      if (!parentNode) return

      let nodeRect: DOMRectReadOnly
      let parentRect: DOMRectReadOnly

      if (strategy === 'async') {
        const [nr, pr] = await Promise.all([
          getBoundingClientRectAsync(node),
          getBoundingClientRectAsync(parentNode),
        ])

        if (nr === false || pr === false) {
          return
        }

        // cancel if we skipped a frame
        if (frameId !== lastFrameAt) {
          return
        }

        nodeRect = nr
        parentRect = pr
      } else {
        nodeRect = node.getBoundingClientRect()
        parentRect = parentNode.getBoundingClientRect()
      }

      const cachedRect = NodeRectCache.get(node)
      const cachedParentRect = NodeRectCache.get(parentNode)

      if (
        !cachedRect ||
        // has changed one rect
        // @ts-expect-error DOMRectReadOnly can go into object
        (!isEqualShallow(cachedRect, nodeRect) &&
          // @ts-expect-error DOMRectReadOnly can go into object
          (!cachedParentRect || !isEqualShallow(cachedParentRect, parentRect)))
      ) {
        NodeRectCache.set(node, nodeRect)
        ParentRectCache.set(parentNode, parentRect)

        const event = getElementLayoutEvent(nodeRect, parentRect)

        if (avoidUpdates) {
          queuedUpdates.set(node, () => onLayout(event))
        } else {
          onLayout(event)
        }
      }
    }

    // note that getBoundingClientRect() does not thrash layout if its after an animation frame
    rAF!(layoutOnAnimationFrame)

    // only run once in a few frames, this could be adjustable
    let frameCount = 0
    const RUN_EVERY_X_FRAMES = 4

    function layoutOnAnimationFrame() {
      const now = Date.now()
      const timeSinceLastFrame = now - lastFrameAt
      lastFrameAt = now

      frameCount++

      if (frameCount % RUN_EVERY_X_FRAMES === 0) {
        frameCount = 0
        rAF!(layoutOnAnimationFrame)
        return
      }

      if (strategy !== 'off') {
        // for both strategies:
        // avoid updates if we've been dropping frames (indicates sync work happening)
        const hasRecentSyncWork =
          timeSinceLastFrame > expectedFrameTime * numDroppedFramesUntilPause

        if (!hasRecentSyncWork) {
          Nodes.forEach((node) => {
            updateLayoutIfChanged(node, lastFrameAt)
          })
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

export const getElementLayoutEvent = (
  nodeRect: DOMRectReadOnly,
  parentRect: DOMRectReadOnly
): LayoutEvent => {
  return {
    nativeEvent: {
      layout: getRelativeDimensions(nodeRect, parentRect),
      target: nodeRect,
    },
    timeStamp: Date.now(),
  }
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
): void => {
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
  const layout = await measureLayoutAsync(target)
  if (!layout) {
    throw new Error(`‼️`) // impossible
  }
  return {
    nativeEvent: {
      layout,
      target,
    },
    timeStamp: Date.now(),
  }
}

export const measureLayoutAsync = async (
  node: HTMLElement,
  relativeTo?: HTMLElement | null
): Promise<null | LayoutValue> => {
  const relativeNode = relativeTo || node?.parentElement
  if (relativeNode instanceof HTMLElement) {
    const [nodeDim, relativeNodeDim] = await Promise.all([
      getBoundingClientRectAsync(node),
      getBoundingClientRectAsync(relativeNode),
    ])

    if (relativeNodeDim && nodeDim) {
      const { x, y, width, height, left, top } = getRelativeDimensions(
        nodeDim,
        relativeNodeDim
      )
      return { x, y, width, height, left, top }
    }
  }
  return null
}

const getRelativeDimensions = (a: DOMRectReadOnly, b: DOMRectReadOnly) => {
  const { height, left, top, width } = a
  const x = left - b.left
  const y = top - b.top
  return { x, y, width, height, left, top }
}

export function useElementLayout(
  ref: RefObject<TamaguiComponentStatePartial>,
  onLayout?: ((e: LayoutEvent) => void) | null
): void {
  // ensure always up to date so we can avoid re-running effect
  const node = ensureWebElement(ref.current?.host)
  if (node && onLayout) {
    LayoutHandlers.set(node, onLayout)
  }

  useIsomorphicLayoutEffect(() => {
    if (!onLayout) return
    const node = ref.current?.host
    if (!node) return

    LayoutHandlers.set(node, onLayout)
    Nodes.add(node)

    // Add node to intersection observer
    startGlobalIntersectionObserver()
    if (globalIntersectionObserver) {
      globalIntersectionObserver.observe(node)
      // Initialize as intersecting by default
      IntersectionState.set(node, true)
    }

    // always do one immediate sync layout event no matter the strategy for accuracy
    const parentNode = node.parentNode
    if (parentNode) {
      onLayout(
        getElementLayoutEvent(
          node.getBoundingClientRect(),
          parentNode.getBoundingClientRect()
        )
      )
    }

    return () => {
      Nodes.delete(node)
      LayoutHandlers.delete(node)
      NodeRectCache.delete(node)
      LastChangeTime.delete(node)
      IntersectionState.delete(node)

      // Remove from intersection observer
      if (globalIntersectionObserver) {
        globalIntersectionObserver.unobserve(node)
      }
    }
  }, [ref, !!onLayout])
}

function ensureWebElement<X>(x: X): HTMLElement | undefined {
  if (typeof HTMLElement === 'undefined') {
    return undefined
  }
  return x instanceof HTMLElement ? x : undefined
}

const getBoundingClientRectAsync = (
  node: HTMLElement | null
): Promise<DOMRectReadOnly | false> => {
  return new Promise<DOMRectReadOnly | false>((res) => {
    if (!node || node.nodeType !== 1) return res(false)

    const io = new IntersectionObserver(
      (entries) => {
        io.disconnect()
        return res(entries[0].boundingClientRect)
      },
      {
        threshold: 0,
      }
    )
    io.observe(node)
  })
}

const getBoundingClientRect = (node: HTMLElement | null): undefined | DOMRect => {
  if (!node || node.nodeType !== 1) return
  return node.getBoundingClientRect?.()
}

export const getRect = (node: HTMLElement): LayoutValue | undefined => {
  const rect = getBoundingClientRect(node)
  if (!rect) return
  const { x, y, top, left } = rect
  return { x, y, width: node.offsetWidth, height: node.offsetHeight, top, left }
}
