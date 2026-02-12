import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { isEqualShallow } from '@tamagui/is-equal-shallow'
import {
  createContext,
  useContext,
  useId,
  useRef,
  type ReactNode,
  type RefObject,
} from 'react'

const LayoutHandlers = new WeakMap<HTMLElement, Function>()
const LayoutDisableKey = new WeakMap<HTMLElement, string>()
const Nodes = new Set<HTMLElement>()
const IntersectionState = new WeakMap<HTMLElement, boolean>()

let _debugLayout: boolean | undefined

function isDebugLayout() {
  if (_debugLayout === undefined) {
    _debugLayout =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).has('__tamaDebugLayout')
  }
  return _debugLayout
}

// separating to avoid all re-rendering
const DisableLayoutContextValues: Record<string, boolean> = {}
const DisableLayoutContextKey = createContext<string>('')

const ENABLE =
  process.env.TAMAGUI_TARGET === 'web' && typeof IntersectionObserver !== 'undefined'

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

      if (process.env.NODE_ENV === 'development' && isDebugLayout()) {
        const el = node as HTMLElement
        console.log('[useElementLayout] change', {
          tag: el.tagName,
          id: el.id || undefined,
          className: (el.className || '').slice(0, 60) || undefined,
          layout: event.nativeEvent.layout,
          first: !cachedRect,
        })
      }

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
      const ioCreateTime = performance.now()
      const didRun = await new Promise<boolean>((res) => {
        const io = new IntersectionObserver(
          (entries) => {
            const callbackDelay = Math.round(performance.now() - ioCreateTime)
            io.disconnect()
            for (const entry of entries) {
              BoundingRects.set(entry.target, entry.boundingClientRect)
            }
            if (callbackDelay > 50) {
              console.warn(
                '[onLayout-io-delay]',
                callbackDelay + 'ms',
                entries.length,
                'entries'
              )
            }
            res(true)
          },
          {
            threshold: 0,
          }
        )

        let didObserve = false

        for (const node of Nodes) {
          if (!(node.parentElement instanceof HTMLElement)) {
            cleanupNode(node)
            continue
          }
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

function cleanupNode(node: HTMLElement) {
  Nodes.delete(node)
  LayoutHandlers.delete(node)
  LayoutDisableKey.delete(node)
  NodeRectCache.delete(node)
  LastChangeTime.delete(node)
  IntersectionState.delete(node)
  if (globalIntersectionObserver) {
    globalIntersectionObserver.unobserve(node)
  }
}

// track previous host node per hook instance to detect when it changes
const PrevHostNode = new WeakMap<object, HTMLElement | undefined>()

export function useElementLayout(
  ref: RefObject<TamaguiComponentStatePartial>,
  onLayout?: ((e: LayoutEvent) => void) | null
): void {
  const disableKey = useContext(DisableLayoutContextKey)
  const hostSwappedRef = useRef(false)

  const node = ensureWebElement(ref.current?.host)
  const prevNode = PrevHostNode.get(ref)

  // detect when the host DOM node changes between renders
  if (node !== prevNode) {
    if (prevNode) {
      cleanupNode(prevNode)
    }

    PrevHostNode.set(ref, node)

    // register new node
    if (node && onLayout) {
      Nodes.add(node)
      startGlobalObservers()
      if (globalIntersectionObserver) {
        globalIntersectionObserver.observe(node)
        IntersectionState.set(node, true)
      }
      hostSwappedRef.current = true
    }
  }

  if (node && onLayout) {
    LayoutHandlers.set(node, onLayout)
    LayoutDisableKey.set(node, disableKey)
  }

  // fire immediate sync layout after a host swap (runs after commit, not during render)
  useIsomorphicLayoutEffect(() => {
    if (!hostSwappedRef.current) return
    hostSwappedRef.current = false
    const node = ensureWebElement(ref.current?.host)
    if (!node) return
    const handler = LayoutHandlers.get(node)
    if (typeof handler !== 'function') return
    const parentNode = node.parentElement
    if (!parentNode) return
    const nodeRect = node.getBoundingClientRect()
    const parentRect = parentNode.getBoundingClientRect()
    NodeRectCache.set(node, nodeRect)
    NodeRectCache.set(parentNode, parentRect)
    handler(getElementLayoutEvent(nodeRect, parentRect))
  })

  useIsomorphicLayoutEffect(() => {
    if (!onLayout) return
    const node = ref.current?.host
    if (!node) return

    // ensure registered (may already be from the render-time check above)
    Nodes.add(node)

    // Add node to intersection observer
    startGlobalObservers()
    if (globalIntersectionObserver) {
      globalIntersectionObserver.observe(node)
      // Initialize as intersecting by default
      IntersectionState.set(node, true)
    }

    if (process.env.NODE_ENV === 'development' && isDebugLayout()) {
      console.log('[useElementLayout] register', {
        tag: node.tagName,
        id: node.id || undefined,
        className: (node.className || '').slice(0, 60) || undefined,
        totalNodes: Nodes.size,
      })
    }

    // always do one immediate sync layout event no matter the strategy for accuracy
    const parentNode = node.parentNode
    if (parentNode) {
      const event = getElementLayoutEvent(
        node.getBoundingClientRect(),
        parentNode.getBoundingClientRect()
      )

      if (process.env.NODE_ENV === 'development' && isDebugLayout()) {
        console.log('[useElementLayout] initial', {
          tag: node.tagName,
          id: node.id || undefined,
          layout: event.nativeEvent.layout,
        })
      }

      onLayout(event)
    }

    return () => {
      if (process.env.NODE_ENV === 'development' && isDebugLayout()) {
        console.log('[useElementLayout] unregister', {
          tag: node.tagName,
          id: node.id || undefined,
          remainingNodes: Nodes.size - 1,
        })
      }

      // clean up the node captured when the effect ran
      cleanupNode(node)

      // also clean up any node that was swapped in via render-time host detection,
      // since the effect deps [ref, !!onLayout] don't change on host swap
      const swappedNode = PrevHostNode.get(ref)
      if (swappedNode && swappedNode !== node) {
        cleanupNode(swappedNode)
      }
      PrevHostNode.delete(ref)
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
