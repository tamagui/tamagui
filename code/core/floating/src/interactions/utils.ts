// shared utilities for interaction hooks, ported from floating-ui/react

export function getDocument(node: Element | null | undefined): Document {
  return node?.ownerDocument || document
}

export function contains(parent?: Element | null, child?: Element | null): boolean {
  if (!parent || !child) return false
  const rootNode = child.getRootNode?.()
  if (parent.contains(child)) return true
  // shadow DOM support
  if (rootNode && isShadowRoot(rootNode)) {
    let next: any = child
    while (next) {
      if (parent === next) return true
      next = next.parentNode || next.host
    }
  }
  return false
}

function isShadowRoot(node: Node): node is ShadowRoot {
  return node instanceof ShadowRoot
}

export function getTarget(event: Event): EventTarget | null {
  if ('composedPath' in event) {
    return event.composedPath()[0]
  }
  return (event as Event).target
}

export function activeElement(doc: Document): Element | null {
  let el = doc.activeElement
  while (el?.shadowRoot?.activeElement != null) {
    el = el.shadowRoot.activeElement
  }
  return el
}

export function isHTMLElement(value: unknown): value is HTMLElement {
  return value instanceof HTMLElement
}

export function isElement(value: unknown): value is Element {
  return value instanceof Element
}

const TYPEABLE_SELECTOR =
  "input:not([type='hidden']):not([disabled])," +
  "[contenteditable]:not([contenteditable='false']),textarea:not([disabled])"

export function isTypeableElement(element: unknown): boolean {
  return isHTMLElement(element) && element.matches(TYPEABLE_SELECTOR)
}

export function isTypeableCombobox(element: Element | null): boolean {
  if (!element) return false
  return element.getAttribute('role') === 'combobox' && isTypeableElement(element)
}

function getPlatform(): string {
  const uaData = (navigator as any).userAgentData as any
  if (uaData?.platform) return uaData.platform
  return navigator.platform
}

function getUserAgent(): string {
  const uaData = (navigator as any).userAgentData as any
  if (uaData && Array.isArray(uaData.brands)) {
    return uaData.brands.map(({ brand, version }: any) => `${brand}/${version}`).join(' ')
  }
  return navigator.userAgent
}

export function isSafari(): boolean {
  return /apple/i.test(navigator.vendor)
}

export function isMac(): boolean {
  return getPlatform().toLowerCase().startsWith('mac') && !navigator.maxTouchPoints
}

function isJSDOM(): boolean {
  return getUserAgent().includes('jsdom/')
}

export function matchesFocusVisible(element: Element | null): boolean {
  if (!element || isJSDOM()) return true
  try {
    return element.matches(':focus-visible')
  } catch {
    return true
  }
}

export function isMouseLikePointerType(
  pointerType: string | undefined,
  strict?: boolean
): boolean {
  const values: Array<string | undefined> = ['mouse', 'pen']
  if (!strict) {
    values.push('', undefined)
  }
  return values.includes(pointerType)
}

export function clearTimeoutIfSet(timeoutRef: { current: number }): void {
  if (timeoutRef.current !== -1) {
    clearTimeout(timeoutRef.current)
    timeoutRef.current = -1
  }
}

export function stopEvent(event: Event | React.SyntheticEvent): void {
  event.preventDefault()
  event.stopPropagation()
}

export function isVirtualClick(event: MouseEvent | PointerEvent): boolean {
  if ((event as any).mozInputSource === 0 && event.isTrusted) return true
  if (isAndroid() && (event as PointerEvent).pointerType) {
    return event.type === 'click' && event.buttons === 1
  }
  return event.detail === 0 && !(event as PointerEvent).pointerType
}

export function isVirtualPointerEvent(event: PointerEvent): boolean {
  if (isJSDOM()) return false
  return (
    (!isAndroid() && event.width === 0 && event.height === 0) ||
    (isAndroid() &&
      event.width === 1 &&
      event.height === 1 &&
      event.pressure === 0 &&
      event.detail === 0 &&
      event.pointerType === 'mouse') ||
    (event.width < 1 &&
      event.height < 1 &&
      event.pressure === 0 &&
      event.detail === 0 &&
      event.pointerType === 'touch')
  )
}

function isAndroid(): boolean {
  const re = /android/i
  return re.test(getPlatform()) || re.test(getUserAgent())
}

// focus enqueue helper
let rafId = 0
export function enqueueFocus(
  el: HTMLElement | null,
  options: { preventScroll?: boolean; cancelPrevious?: boolean; sync?: boolean } = {}
): void {
  const { preventScroll = false, cancelPrevious = true, sync = false } = options
  cancelPrevious && cancelAnimationFrame(rafId)
  const exec = () => el?.focus({ preventScroll })
  if (sync) {
    exec()
  } else {
    rafId = requestAnimationFrame(exec)
  }
}

// list navigation utilities

type DisabledIndices = Array<number> | ((index: number) => boolean)

export function isListIndexDisabled(
  listRef: { current: Array<HTMLElement | null> },
  index: number,
  disabledIndices?: DisabledIndices
): boolean {
  if (typeof disabledIndices === 'function') return disabledIndices(index)
  if (disabledIndices) return disabledIndices.includes(index)
  const element = listRef.current[index]
  return (
    element == null ||
    element.hasAttribute('disabled') ||
    element.getAttribute('aria-disabled') === 'true'
  )
}

export function findNonDisabledListIndex(
  listRef: { current: Array<HTMLElement | null> },
  {
    startingIndex = -1,
    decrement = false,
    disabledIndices,
    amount = 1,
  }: {
    startingIndex?: number
    decrement?: boolean
    disabledIndices?: DisabledIndices
    amount?: number
  } = {}
): number {
  let index = startingIndex
  do {
    index += decrement ? -amount : amount
  } while (
    index >= 0 &&
    index <= listRef.current.length - 1 &&
    isListIndexDisabled(listRef, index, disabledIndices)
  )
  return index
}

export function getMinListIndex(
  listRef: { current: Array<HTMLElement | null> },
  disabledIndices: DisabledIndices | undefined
): number {
  return findNonDisabledListIndex(listRef, { disabledIndices })
}

export function getMaxListIndex(
  listRef: { current: Array<HTMLElement | null> },
  disabledIndices: DisabledIndices | undefined
): number {
  return findNonDisabledListIndex(listRef, {
    decrement: true,
    startingIndex: listRef.current.length,
    disabledIndices,
  })
}

export function isIndexOutOfListBounds(
  listRef: { current: Array<HTMLElement | null> },
  index: number
): boolean {
  return index < 0 || index >= listRef.current.length
}
