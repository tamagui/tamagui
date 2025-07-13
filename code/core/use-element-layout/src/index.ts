import { isClient, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { isEqualShallow } from '@tamagui/is-equal-shallow'
import { useCallback, type RefObject } from 'react'

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
  pageX: number
  pageY: number
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

function startGlobalObservers() {
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

    const BoundingRects = new WeakMap<any, DOMRectReadOnly | undefined>()

    async function updateLayoutIfChanged(node: HTMLElement) {
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
          BoundingRects.get(node) || getBoundingClientRectAsync(node),
          BoundingRects.get(parentNode) || getBoundingClientRectAsync(parentNode),
        ])

        if (nr === false || pr === false) {
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
    // ok new note: *if* it needed recalc then yea, but browsers often skip that, so it does
    // which is why we use async strategy in general
    rAF!(layoutOnAnimationFrame)

    // only run once in a few frames, this could be adjustable
    let frameCount = 0

    const userSkipVal = process.env.TAMAGUI_LAYOUT_FRAME_SKIP
    const RUN_EVERY_X_FRAMES = userSkipVal ? +userSkipVal : 10

    async function layoutOnAnimationFrame() {
      if (strategy !== 'off') {
        if (!Nodes.size || frameCount++ % RUN_EVERY_X_FRAMES !== 0) {
          // skip a few frames to avoid work
          rAF!(layoutOnAnimationFrame)
          return
        }

        if (frameCount === Number.MAX_SAFE_INTEGER) {
          frameCount = 0
        }

        // do a 1 rather than N IntersectionObservers for performance
        await new Promise<void>((res) => {
          const io = new IntersectionObserver(
            (entries) => {
              io.disconnect()
              for (const entry of entries) {
                BoundingRects.set(entry.target, entry.boundingClientRect)
              }
              res()
            },
            {
              threshold: 0,
            }
          )
          for (const node of Nodes) {
            if (node.parentElement instanceof HTMLElement) {
              io.observe(node)
              io.observe(node.parentElement)
            }
          }
        })

        Nodes.forEach((node) => {
          updateLayoutIfChanged(node)
        })
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

const getRelativeDimensions = (a: DOMRectReadOnly, b: DOMRectReadOnly) => {
  const { height, left, top, width } = a
  const x = left - b.left
  const y = top - b.top
  return { x, y, width, height, pageX: a.left, pageY: a.top }
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

    Nodes.add(node)

    // Add node to intersection observer
    startGlobalObservers()
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

export const getBoundingClientRectAsync = (
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

export const measureNode = async (
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
      return getRelativeDimensions(nodeDim, relativeNodeDim)
    }
  }
  return null
}

type MeasureInWindowCb = (x: number, y: number, width: number, height: number) => void

type MeasureCb = (
  x: number,
  y: number,
  width: number,
  height: number,
  pageX: number,
  pageY: number
) => void

export const measure = async (
  node: HTMLElement,
  callback: MeasureCb
): Promise<LayoutValue | null> => {
  const out = await measureNode(
    node,
    node.parentNode instanceof HTMLElement ? node.parentNode : null
  )
  if (out) {
    callback?.(out.x, out.y, out.width, out.height, out.pageX, out.pageY)
  }
  return out
}

export function createMeasure(
  node: HTMLElement
): (callback: MeasureCb) => Promise<LayoutValue | null> {
  return (callback) => measure(node, callback)
}

type WindowLayout = { pageX: number; pageY: number; width: number; height: number }

export const measureInWindow = async (
  node: HTMLElement,
  callback: MeasureInWindowCb
): Promise<WindowLayout | null> => {
  const out = await measureNode(node, null)
  if (out) {
    callback?.(out.pageX, out.pageY, out.width, out.height)
  }
  return out
}

export const createMeasureInWindow = (
  node: HTMLElement
): ((callback: MeasureInWindowCb) => Promise<WindowLayout | null>) => {
  return (callback) => measureInWindow(node, callback)
}

export const measureLayout = async (
  node: HTMLElement,
  relativeNode: HTMLElement,
  callback: MeasureCb
): Promise<LayoutValue | null> => {
  const out = await measureNode(node, relativeNode)
  if (out) {
    callback?.(out.x, out.y, out.width, out.height, out.pageX, out.pageY)
  }
  return out
}

export function createMeasureLayout(
  node: HTMLElement
): (relativeTo: HTMLElement, callback: MeasureCb) => Promise<LayoutValue | null> {
  return (relativeTo, callback) => measureLayout(node, relativeTo, callback)
}
