import { isClient, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { isEqualShallow } from '@tamagui/is-equal-shallow'
import { createContext, useContext, useId, type ReactNode, type RefObject } from 'react'

const LayoutHandlers = new WeakMap<HTMLElement, Function>()
const LayoutDisableKey = new WeakMap<HTMLElement, string>()
const Nodes = new Set<HTMLElement>()
const IntersectionState = new WeakMap<HTMLElement, boolean>()

// separating to avoid all re-rendering
const DisableLayoutContextValues: Record<string, boolean> = {}
const DisableLayoutContextKey = createContext<string>('')

const ENABLE = isClient && typeof IntersectionObserver !== 'undefined'

// internal testing - advanced helper to turn off layout measurement for extra performance
// TODO document!
// TODO could add frame skip control here
export const LayoutMeasurementController = ({
  disable,
  children,
}: {
  disable: boolean
  children: ReactNode
}): ReactNode => {
  const id = useId()

  useIsomorphicLayoutEffect(() => {
    DisableLayoutContextValues[id] = disable
  }, [disable, id])

  return (
    <DisableLayoutContextKey.Provider value={id}>
      {children}
    </DisableLayoutContextKey.Provider>
  )
}

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
const LastChangeTime = new WeakMap<HTMLElement, number>()

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
  if (!ENABLE || globalIntersectionObserver) return

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

if (ENABLE) {
  const BoundingRects = new WeakMap<any, DOMRectReadOnly | undefined>()

  async function updateLayoutIfChanged(node: HTMLElement) {
    const onLayout = LayoutHandlers.get(node)
    if (typeof onLayout !== 'function') return

    const parentNode = node.parentElement
    if (!parentNode) return

    let nodeRect: DOMRectReadOnly
    let parentRect: DOMRectReadOnly

    if (strategy === 'async') {
      const [nr, pr] = await Promise.all([
        BoundingRects.get(node),
        BoundingRects.get(parentNode),
      ])

      if (!nr || !pr) {
        return
      }

      nodeRect = nr
      parentRect = pr
    } else {
      nodeRect = node.getBoundingClientRect()
      parentRect = parentNode.getBoundingClientRect()
    }

    if (!nodeRect || !parentRect) {
      return
    }

    const cachedRect = NodeRectCache.get(node)
    const cachedParentRect = NodeRectCache.get(parentNode)

    if (
      !cachedRect ||
      !cachedParentRect ||
      // has changed one rect
      // @ts-expect-error DOMRectReadOnly can go into object
      !isEqualShallow(cachedRect, nodeRect) ||
      // @ts-expect-error DOMRectReadOnly can go into object
      !isEqualShallow(cachedParentRect, parentRect)
    ) {
      NodeRectCache.set(node, nodeRect)
      NodeRectCache.set(parentNode, parentRect)

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

  const userSkipVal = process.env.TAMAGUI_LAYOUT_FRAME_SKIP
  const RUN_EVERY_X_FRAMES = userSkipVal ? +userSkipVal : 14

  async function layoutOnAnimationFrame() {
    if (strategy !== 'off') {
      const visibleNodes: HTMLElement[] = []

      // do a 1 rather than N IntersectionObservers for performance
      const didRun = await new Promise<boolean>((res) => {
        const io = new IntersectionObserver(
          (entries) => {
            io.disconnect()
            for (const entry of entries) {
              BoundingRects.set(entry.target, entry.boundingClientRect)
            }
            res(true)
          },
          {
            threshold: 0,
          }
        )

        let didObserve = false

        for (const node of Nodes) {
          if (!(node.parentElement instanceof HTMLElement)) continue
          const disableKey = LayoutDisableKey.get(node)
          if (disableKey && DisableLayoutContextValues[disableKey] === true) continue
          if (IntersectionState.get(node) === false) continue
          didObserve = true
          io.observe(node)
          io.observe(node.parentElement)
          visibleNodes.push(node)
        }

        if (!didObserve) {
          res(false)
        }
      })

      if (didRun) {
        visibleNodes.forEach((node) => {
          updateLayoutIfChanged(node)
        })
      }
    }

    setTimeout(layoutOnAnimationFrame, 16.6667 * RUN_EVERY_X_FRAMES)
  }

  layoutOnAnimationFrame()
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
  const disableKey = useContext(DisableLayoutContextKey)

  // ensure always up to date so we can avoid re-running effect
  const node = ensureWebElement(ref.current?.host)
  if (node && onLayout) {
    LayoutHandlers.set(node, onLayout)
    LayoutDisableKey.set(node, disableKey)
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
