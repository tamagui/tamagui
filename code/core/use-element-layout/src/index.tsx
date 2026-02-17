import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { createContext, useContext, useId, type ReactNode, type RefObject } from 'react'

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

// Single persistent IntersectionObserver for visibility tracking
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
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        const node = entry.target as HTMLElement
        if (IntersectionState.get(node) !== entry.isIntersecting) {
          IntersectionState.set(node, entry.isIntersecting)
        }
      }
    },
    {
      threshold: 0,
    }
  )
}

// optimization: inline rect comparison to avoid function call overhead on hot path
function rectsEqual(a: DOMRectReadOnly, b: DOMRectReadOnly): boolean {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
}

if (ENABLE) {
  const BoundingRects = new WeakMap<Element, DOMRectReadOnly>()

  // optimization: persistent IO for rect fetching, reused across cycles
  let rectFetchObserver: IntersectionObserver | null = null
  let rectFetchResolve: ((value: boolean) => void) | null = null
  let rectFetchStartTime = 0
  let lastCallbackDelay = 0

  function ensureRectFetchObserver() {
    if (rectFetchObserver) return rectFetchObserver

    rectFetchObserver = new IntersectionObserver(
      (entries) => {
        lastCallbackDelay = Math.round(performance.now() - rectFetchStartTime)

        // store all rects
        for (let i = 0; i < entries.length; i++) {
          BoundingRects.set(entries[i].target, entries[i].boundingClientRect)
        }

        if (
          process.env.NODE_ENV === 'development' &&
          isDebugLayout() &&
          lastCallbackDelay > 50
        ) {
          console.warn(
            '[onLayout-io-delay]',
            lastCallbackDelay + 'ms',
            entries.length,
            'entries'
          )
        }

        if (rectFetchResolve) {
          rectFetchResolve(true)
          rectFetchResolve = null
        }
      },
      {
        threshold: 0,
      }
    )

    return rectFetchObserver
  }

  async function updateLayoutIfChanged(node: HTMLElement) {
    const onLayout = LayoutHandlers.get(node)
    if (typeof onLayout !== 'function') return

    const parentNode = node.parentElement
    if (!parentNode) return

    let nodeRect: DOMRectReadOnly | undefined
    let parentRect: DOMRectReadOnly | undefined

    // respect the strategy contract
    if (strategy === 'async') {
      nodeRect = BoundingRects.get(node)
      parentRect = BoundingRects.get(parentNode)

      if (!nodeRect || !parentRect) {
        return
      }
    } else {
      nodeRect = node.getBoundingClientRect()
      parentRect = parentNode.getBoundingClientRect()
    }

    const cachedRect = NodeRectCache.get(node)
    const cachedParentRect = NodeRectCache.get(parentNode)

    // optimization: inline comparison instead of isEqualShallow
    const nodeChanged = !cachedRect || !rectsEqual(cachedRect, nodeRect)
    const parentChanged = !cachedParentRect || !rectsEqual(cachedParentRect, parentRect)

    if (nodeChanged || parentChanged) {
      NodeRectCache.set(node, nodeRect as DOMRect)
      NodeRectCache.set(parentNode, parentRect as DOMRect)

      const event = getElementLayoutEvent(nodeRect, parentRect)

      if (process.env.NODE_ENV === 'development' && isDebugLayout()) {
        console.log('[useElementLayout] change', {
          tag: node.tagName,
          id: node.id || undefined,
          className: (node.className || '').slice(0, 60) || undefined,
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

  const rAF =
    typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : undefined

  // adaptive frame skipping with backoff
  const userSkipVal = process.env.TAMAGUI_LAYOUT_FRAME_SKIP
  const BASE_SKIP_FRAMES = userSkipVal ? +userSkipVal : 6
  const MAX_SKIP_FRAMES = 20
  let skipFrames = BASE_SKIP_FRAMES
  let frameCount = 0

  async function layoutOnAnimationFrame() {
    // skip frames based on adaptive rate
    if (frameCount++ % skipFrames !== 0) {
      rAF ? rAF(layoutOnAnimationFrame) : setTimeout(layoutOnAnimationFrame, 16)
      return
    }

    // reset frame count to avoid overflow
    if (frameCount >= Number.MAX_SAFE_INTEGER) {
      frameCount = 0
    }

    if (strategy !== 'off') {
      const visibleNodes: HTMLElement[] = []
      // optimization: deduplicate parent observations
      const parentsToObserve = new Set<HTMLElement>()

      // collect visible nodes and their unique parents
      for (const node of Nodes) {
        const parentElement = node.parentElement
        if (!(parentElement instanceof HTMLElement)) {
          cleanupNode(node)
          continue
        }
        const disableKey = LayoutDisableKey.get(node)
        if (disableKey && DisableLayoutContextValues[disableKey] === true) continue
        if (IntersectionState.get(node) === false) continue

        visibleNodes.push(node)
        parentsToObserve.add(parentElement)
      }

      if (visibleNodes.length > 0) {
        const io = ensureRectFetchObserver()
        rectFetchStartTime = performance.now()

        // observe all nodes
        for (let i = 0; i < visibleNodes.length; i++) {
          io.observe(visibleNodes[i])
        }
        // optimization: observe unique parents only (not N times for N children)
        for (const parent of parentsToObserve) {
          io.observe(parent)
        }

        // wait for callback
        await new Promise<boolean>((res) => {
          rectFetchResolve = res
        })

        // unobserve all to reset for next cycle
        for (let i = 0; i < visibleNodes.length; i++) {
          io.unobserve(visibleNodes[i])
        }
        for (const parent of parentsToObserve) {
          io.unobserve(parent)
        }

        // adaptive backoff: if IO was slow, skip more frames next cycle
        if (lastCallbackDelay > 50) {
          skipFrames = Math.min(skipFrames + 2, MAX_SKIP_FRAMES)
        } else if (lastCallbackDelay < 20) {
          // recover back to base rate when things are fast
          skipFrames = Math.max(skipFrames - 1, BASE_SKIP_FRAMES)
        }

        // process updates
        for (let i = 0; i < visibleNodes.length; i++) {
          updateLayoutIfChanged(visibleNodes[i])
        }
      }
    }

    // schedule next frame
    rAF ? rAF(layoutOnAnimationFrame) : setTimeout(layoutOnAnimationFrame, 16)
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
  IntersectionState.delete(node)
  if (globalIntersectionObserver) {
    globalIntersectionObserver.unobserve(node)
  }
}

const PrevHostNode = new WeakMap<object, HTMLElement | undefined>()

export function useElementLayout(
  ref: RefObject<TamaguiComponentStatePartial>,
  onLayout?: ((e: LayoutEvent) => void) | null
): void {
  const disableKey = useContext(DisableLayoutContextKey)

  // keep handlers up to date so polling always calls the latest callback
  const node = ensureWebElement(ref.current?.host)
  if (node && onLayout) {
    LayoutHandlers.set(node, onLayout)
    LayoutDisableKey.set(node, disableKey)
  }

  // detect host swaps after commit and fire immediate sync layout
  useIsomorphicLayoutEffect(() => {
    if (!onLayout) return
    const nextNode = ensureWebElement(ref.current?.host)
    const prevNode = PrevHostNode.get(ref)
    if (nextNode === prevNode) return

    if (prevNode) cleanupNode(prevNode)
    PrevHostNode.set(ref, nextNode)
    if (!nextNode) return

    Nodes.add(nextNode)
    startGlobalObservers()
    if (globalIntersectionObserver) {
      globalIntersectionObserver.observe(nextNode)
      IntersectionState.set(nextNode, true)
    }

    const handler = LayoutHandlers.get(nextNode)
    if (typeof handler !== 'function') return
    const parentNode = nextNode.parentElement
    if (!parentNode) return

    const nodeRect = nextNode.getBoundingClientRect()
    const parentRect = parentNode.getBoundingClientRect()
    NodeRectCache.set(nextNode, nodeRect)
    NodeRectCache.set(parentNode, parentRect)
    handler(getElementLayoutEvent(nodeRect, parentRect))
  })

  useIsomorphicLayoutEffect(() => {
    if (!onLayout) return
    const node = ref.current?.host
    if (!node) return

    Nodes.add(node)

    startGlobalObservers()
    if (globalIntersectionObserver) {
      globalIntersectionObserver.observe(node)
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

    // always do one immediate sync layout event for accuracy
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
      cleanupNode(node)

      // also clean up any node from a mid-lifecycle host swap
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
