import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { createContext, useContext, useId, type ReactNode, type RefObject } from 'react'

const LayoutHandlers = new WeakMap<HTMLElement, Function>()
const LayoutDisableKey = new WeakMap<HTMLElement, string>()
const Nodes = new Set<HTMLElement>()
const NodeRectCache = new WeakMap<HTMLElement, DOMRectReadOnly>()
const PrevHostNode = new WeakMap<object, HTMLElement | undefined>()

const usePretransformDimensions = () =>
  (globalThis as any).__TAMAGUI_ONLAYOUT_PRETRANSFORM === true ||
  process.env.TAMAGUI_ONLAYOUT_PRETRANSFORM === '1'

let _debugLayout: boolean | undefined
function isDebugLayout() {
  if (_debugLayout === undefined) {
    _debugLayout =
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).has('__tamaDebugLayout')
  }
  return _debugLayout
}

const DisableLayoutContextValues: Record<string, boolean> = {}
const DisableLayoutContextKey = createContext<string>('')

const ENABLE =
  process.env.TAMAGUI_TARGET === 'web' && typeof IntersectionObserver !== 'undefined'

export const LayoutMeasurementController = ({
  disable,
  children,
}: {
  disable: boolean
  children: ReactNode
}): ReactNode => {
  const id = useId()
  useIsomorphicLayoutEffect(() => {
    const wasDisabled = DisableLayoutContextValues[id] === true
    DisableLayoutContextValues[id] = disable
    if (wasDisabled && !disable) measureOnNextFrame?.()
  }, [disable, id])

  return (
    <DisableLayoutContextKey.Provider value={id}>
      {children}
    </DisableLayoutContextKey.Provider>
  )
}

type TamaguiComponentStatePartial = { host?: any }
type LayoutMeasurementStrategy = 'off' | 'sync' | 'async'

let strategy: LayoutMeasurementStrategy = 'async'
let resumeLayoutLoop: (() => void) | undefined
let measureOnNextFrame: (() => void) | undefined

export type LayoutValue = {
  x: number
  y: number
  width: number
  height: number
  pageX: number
  pageY: number
}

export type LayoutEvent = {
  nativeEvent: { layout: LayoutValue; target: any }
  timeStamp: number
}

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

function rectsEqual(a: DOMRectReadOnly, b: DOMRectReadOnly): boolean {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height
}

if (ENABLE) {
  const BoundingRects = new WeakMap<Element, DOMRectReadOnly>()
  let rectFetchObserver: IntersectionObserver | null = null
  let rectFetchResolve: ((value: boolean) => void) | null = null
  let rectFetchStartTime = 0
  let lastCallbackDelay = 0

  function ensureRectFetchObserver() {
    if (rectFetchObserver) return rectFetchObserver
    rectFetchObserver = new IntersectionObserver(
      (entries) => {
        lastCallbackDelay = Math.round(performance.now() - rectFetchStartTime)
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
      { threshold: 0 }
    )
    return rectFetchObserver
  }

  function updateLayoutIfChanged(node: HTMLElement) {
    const onLayout = LayoutHandlers.get(node)
    if (typeof onLayout !== 'function') return
    const parentNode = node.parentElement
    if (!parentNode) return

    let nodeRect: DOMRectReadOnly | undefined
    let parentRect: DOMRectReadOnly | undefined

    if (strategy === 'async') {
      nodeRect = BoundingRects.get(node)
      parentRect = BoundingRects.get(parentNode)
      if (!nodeRect || !parentRect) return
    } else {
      nodeRect = node.getBoundingClientRect()
      parentRect = parentNode.getBoundingClientRect()
    }
    emitLayoutIfChanged(node, parentNode, nodeRect, parentRect)
  }

  const rAF =
    typeof requestAnimationFrame !== 'undefined' ? requestAnimationFrame : undefined
  const userSkipVal = process.env.TAMAGUI_LAYOUT_FRAME_SKIP
  const BASE_SKIP_FRAMES = userSkipVal ? +userSkipVal : 10
  const MAX_SKIP_FRAMES = 20
  let skipFrames = BASE_SKIP_FRAMES
  let frameCount = 0
  let frameScheduled = false

  function scheduleLayoutFrame() {
    if (frameScheduled || strategy === 'off' || Nodes.size === 0 || document.hidden)
      return
    frameScheduled = true
    rAF ? rAF(layoutOnAnimationFrame) : setTimeout(layoutOnAnimationFrame, 16)
  }

  async function layoutOnAnimationFrame() {
    if (frameCount++ % skipFrames !== 0) {
      frameScheduled = false
      scheduleLayoutFrame()
      return
    }
    if (frameCount >= Number.MAX_SAFE_INTEGER) frameCount = 0

    if (strategy !== 'off') {
      const activeNodes: HTMLElement[] = []
      const parentsToObserve = new Set<HTMLElement>()

      for (const node of Nodes) {
        const parentElement = node.parentElement
        if (!(parentElement instanceof HTMLElement)) {
          cleanupNode(node)
          continue
        }
        const disableKey = LayoutDisableKey.get(node)
        if (disableKey && DisableLayoutContextValues[disableKey] === true) continue
        activeNodes.push(node)
        parentsToObserve.add(parentElement)
      }

      if (activeNodes.length > 0) {
        const io = ensureRectFetchObserver()
        rectFetchStartTime = performance.now()
        for (let i = 0; i < activeNodes.length; i++) io.observe(activeNodes[i])
        for (const parent of parentsToObserve) io.observe(parent)

        await new Promise<boolean>((res) => {
          rectFetchResolve = res
        })

        for (let i = 0; i < activeNodes.length; i++) io.unobserve(activeNodes[i])
        for (const parent of parentsToObserve) io.unobserve(parent)

        if (lastCallbackDelay > 50) {
          skipFrames = Math.min(skipFrames + 2, MAX_SKIP_FRAMES)
        } else if (lastCallbackDelay < 20) {
          skipFrames = Math.max(skipFrames - 1, BASE_SKIP_FRAMES)
        }

        for (let i = 0; i < activeNodes.length; i++) updateLayoutIfChanged(activeNodes[i])
      }
    }

    frameScheduled = false
    scheduleLayoutFrame()
  }

  resumeLayoutLoop = scheduleLayoutFrame
  measureOnNextFrame = () => {
    frameCount = 0
    scheduleLayoutFrame()
  }
  document.addEventListener('visibilitychange', scheduleLayoutFrame)
  scheduleLayoutFrame()
}

export const getElementLayoutEvent = (
  nodeRect: DOMRectReadOnly,
  parentRect: DOMRectReadOnly,
  node?: HTMLElement
): LayoutEvent => ({
  nativeEvent: {
    layout: getRelativeDimensions(nodeRect, parentRect, node),
    target: nodeRect,
  },
  timeStamp: Date.now(),
})

const getPreTransformDimensions = (
  node: HTMLElement
): { width: number; height: number } => ({
  width: node.offsetWidth,
  height: node.offsetHeight,
})

const getRelativeDimensions = (
  a: DOMRectReadOnly,
  b: DOMRectReadOnly,
  aNode?: HTMLElement
) => {
  const left = a.left - b.left
  const top = a.top - b.top
  const { width, height } =
    usePretransformDimensions() && aNode
      ? getPreTransformDimensions(aNode)
      : { width: a.width, height: a.height }
  return { x: left, y: top, width, height, pageX: a.left, pageY: a.top }
}

function emitLayoutIfChanged(
  node: HTMLElement,
  parentNode: HTMLElement,
  nodeRect: DOMRectReadOnly,
  parentRect: DOMRectReadOnly
) {
  const onLayout = LayoutHandlers.get(node)
  if (typeof onLayout !== 'function') return

  const cachedRect = NodeRectCache.get(node)
  const cachedParentRect = NodeRectCache.get(parentNode)
  const nodeChanged = !cachedRect || !rectsEqual(cachedRect, nodeRect)
  const parentChanged = !cachedParentRect || !rectsEqual(cachedParentRect, parentRect)

  if (!nodeChanged && !parentChanged) return

  NodeRectCache.set(node, nodeRect)
  NodeRectCache.set(parentNode, parentRect)

  const event = getElementLayoutEvent(nodeRect, parentRect, node)
  if (avoidUpdates) {
    queuedUpdates.set(node, () => onLayout(event))
  } else {
    onLayout(event)
  }
}

function observeLayoutNode(node: HTMLElement, disableKey?: string) {
  Nodes.add(node)
  if (disableKey) LayoutDisableKey.set(node, disableKey)
  else LayoutDisableKey.delete(node)
  resumeLayoutLoop?.()
}

export function registerLayoutNode(
  node: HTMLElement,
  onChange: () => void,
  disableKey?: string
): () => void {
  LayoutHandlers.set(node, onChange)
  observeLayoutNode(node, disableKey)
  return () => cleanupNode(node)
}

function cleanupNode(node: HTMLElement) {
  Nodes.delete(node)
  LayoutHandlers.delete(node)
  LayoutDisableKey.delete(node)
  NodeRectCache.delete(node)
}

function emitLayoutSync(node: HTMLElement) {
  const onLayout = LayoutHandlers.get(node)
  if (typeof onLayout !== 'function') return
  const parentNode = node.parentElement
  if (!parentNode) return

  const nodeRect = node.getBoundingClientRect()
  const parentRect = parentNode.getBoundingClientRect()
  NodeRectCache.set(node, nodeRect)
  NodeRectCache.set(parentNode, parentRect)
  onLayout(getElementLayoutEvent(nodeRect, parentRect, node))
}

export function useElementLayout(
  ref: RefObject<TamaguiComponentStatePartial>,
  onLayout?: ((e: LayoutEvent) => void) | null
): void {
  const disableKey = useContext(DisableLayoutContextKey)
  const node = ensureWebElement(ref.current?.host)
  if (node && onLayout) {
    LayoutHandlers.set(node, onLayout)
    LayoutDisableKey.set(node, disableKey)
  }

  useIsomorphicLayoutEffect(() => {
    if (!onLayout) return
    const nextNode = ensureWebElement(ref.current?.host)
    const prevNode = PrevHostNode.get(ref)
    if (nextNode !== prevNode) {
      if (prevNode) cleanupNode(prevNode)
      PrevHostNode.set(ref, nextNode)
      if (nextNode) {
        LayoutHandlers.set(nextNode, onLayout)
        observeLayoutNode(nextNode, disableKey)
        emitLayoutSync(nextNode)
      }
    }
    return () => {
      const activeNode = ensureWebElement(ref.current?.host)
      if (activeNode) cleanupNode(activeNode)
      const swapped = PrevHostNode.get(ref)
      if (swapped && swapped !== activeNode) cleanupNode(swapped)
      PrevHostNode.delete(ref)
    }
  }, [ref, !!onLayout])
}

function ensureWebElement<X>(x: X): HTMLElement | undefined {
  if (typeof HTMLElement === 'undefined') return undefined
  return x instanceof HTMLElement ? x : undefined
}

export const getBoundingClientRectAsync = (
  node: HTMLElement | null
): Promise<DOMRectReadOnly | false> =>
  new Promise((res) => {
    if (!node || node.nodeType !== 1) return res(false)
    const io = new IntersectionObserver((entries) => {
      io.disconnect()
      res(entries[0].boundingClientRect)
    })
    io.observe(node)
  })

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
      return getRelativeDimensions(nodeDim, relativeNodeDim, node)
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
  if (out) callback?.(out.x, out.y, out.width, out.height, out.pageX, out.pageY)
  return out
}

export const createMeasure =
  (node: HTMLElement): ((callback: MeasureCb) => Promise<LayoutValue | null>) =>
  (callback: MeasureCb) =>
    measure(node, callback)

type WindowLayout = { pageX: number; pageY: number; width: number; height: number }

export const measureInWindow = async (
  node: HTMLElement,
  callback: MeasureInWindowCb
): Promise<WindowLayout | null> => {
  const out = await measureNode(node, null)
  if (out) callback?.(out.pageX, out.pageY, out.width, out.height)
  return out
}

export const createMeasureInWindow =
  (node: HTMLElement): ((callback: MeasureInWindowCb) => Promise<WindowLayout | null>) =>
  (callback: MeasureInWindowCb) =>
    measureInWindow(node, callback)

export const measureLayout = async (
  node: HTMLElement,
  relativeNode: HTMLElement,
  callback: MeasureCb
): Promise<LayoutValue | null> => {
  const out = await measureNode(node, relativeNode)
  if (out) callback?.(out.x, out.y, out.width, out.height, out.pageX, out.pageY)
  return out
}

export const createMeasureLayout =
  (
    node: HTMLElement
  ): ((relativeTo: HTMLElement, callback: MeasureCb) => Promise<LayoutValue | null>) =>
  (relativeTo: HTMLElement, callback: MeasureCb) =>
    measureLayout(node, relativeTo, callback)
