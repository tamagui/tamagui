import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import { idle, useAsyncEffect } from '@tamagui/use-async'
import { useEvent } from '@tamagui/use-event'
import * as React from 'react'
import { useFocusScopeControllerContext } from './FocusScopeController'
import type { FocusScopeProps, ScopedProps } from './types'

const AUTOFOCUS_ON_MOUNT = 'focusScope.autoFocusOnMount'
const AUTOFOCUS_ON_UNMOUNT = 'focusScope.autoFocusOnUnmount'
const EVENT_OPTIONS = { bubbles: false, cancelable: true }

type FocusableTarget = HTMLElement | { focus(): void }

/* -------------------------------------------------------------------------------------------------
 * FocusScope
 * -----------------------------------------------------------------------------------------------*/

type FocusScopeElement = HTMLDivElement

const FocusScope = React.forwardRef<FocusScopeElement, FocusScopeProps>(
  function FocusScope(
    { __scopeFocusScope, ...props }: ScopedProps<FocusScopeProps>,
    forwardedRef
  ) {
    // Check for controller context and merge props
    const context = useFocusScopeControllerContext('FocusScope', __scopeFocusScope, {
      warn: false,
      fallback: {},
    })

    const mergedProps: FocusScopeProps = {
      ...props,
      enabled: context.enabled ?? props.enabled,
      loop: context.loop ?? props.loop,
      trapped: context.trapped ?? props.trapped,
      onMountAutoFocus: context.onMountAutoFocus ?? props.onMountAutoFocus,
      onUnmountAutoFocus: context.onUnmountAutoFocus ?? props.onUnmountAutoFocus,
      forceUnmount: context.forceUnmount ?? props.forceUnmount,
      focusOnIdle: context.focusOnIdle ?? props.focusOnIdle,
    }

    const childProps = useFocusScope(mergedProps, forwardedRef)

    if (typeof mergedProps.children === 'function') {
      return <>{mergedProps.children(childProps)}</>
    }

    return React.cloneElement(
      React.Children.only(mergedProps.children) as any,
      childProps
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * setupFocusTrap - extracted function to set up trap immediately in ref callback
 * -----------------------------------------------------------------------------------------------*/

type FocusScopeAPI = {
  paused: boolean
  stopped: boolean
  pause(): void
  resume(): void
  stop(): void
}

function setupFocusTrap(
  container: HTMLElement,
  lastFocusedElementRef: React.MutableRefObject<HTMLElement | null>,
  focusScope: FocusScopeAPI
): () => void {
  const controller = new AbortController()

  // use rAF to schedule refocus after browser's event handling completes
  // this prevents a loop where we try to refocus but the browser keeps overriding
  let rafId: number | null = null

  function scheduleRefocus() {
    if (rafId) return // already scheduled
    const elementToFocus = lastFocusedElementRef.current
    rafId = requestAnimationFrame(() => {
      rafId = null
      if (focusScope.paused) return
      // check if scope has been stopped (cleanup started)
      if (focusScope.stopped) return
      // check if container is still in DOM (might be unmounting)
      if (!container.isConnected) return
      // check if focus is still outside container
      if (!container.contains(document.activeElement)) {
        focus(elementToFocus)
      }
    })
  }

  function handleFocusIn(event: FocusEvent) {
    if (focusScope.paused) return
    const target = event.target as HTMLElement | null

    if (container.contains(target)) {
      // track the last focused element inside the container
      target?.addEventListener('blur', handleBlur, { signal: controller.signal })
      lastFocusedElementRef.current = target
    } else {
      // focus went outside container, schedule refocus after browser settles
      scheduleRefocus()
    }
  }

  function handleFocusOut(event: FocusEvent) {
    controller.abort()
    if (focusScope.paused) return
    if (!container.contains(event.relatedTarget as HTMLElement | null)) {
      // focus leaving container, schedule refocus after browser settles
      scheduleRefocus()
    }
  }

  // blur handler is a no-op - we keep track of the last focused element
  // and don't reset to container when an element blurs
  function handleBlur() {}

  document.addEventListener('focusin', handleFocusIn)
  document.addEventListener('focusout', handleFocusOut)

  return () => {
    if (rafId) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    controller.abort()
    document.removeEventListener('focusin', handleFocusIn)
    document.removeEventListener('focusout', handleFocusOut)
  }
}

/* -------------------------------------------------------------------------------------------------
 * useFocusScope
 * -----------------------------------------------------------------------------------------------*/

export function useFocusScope(
  props: FocusScopeProps,
  forwardedRef: React.ForwardedRef<FocusScopeElement>
) {
  const {
    loop = false,
    enabled = true,
    trapped = false,
    onMountAutoFocus: onMountAutoFocusProp,
    onUnmountAutoFocus: onUnmountAutoFocusProp,
    forceUnmount,
    focusOnIdle = true,
    children,
    ...scopeProps
  } = props
  const [container, setContainer] = React.useState<HTMLElement | null>(null)
  const containerRef = React.useRef<HTMLElement | null>(null)
  const onMountAutoFocus = useEvent(onMountAutoFocusProp)
  const onUnmountAutoFocus = useEvent(onUnmountAutoFocusProp)
  const lastFocusedElementRef = React.useRef<HTMLElement | null>(null)

  const focusScopeRef = React.useRef({
    paused: false,
    stopped: false, // set to true when cleanup starts, signals trap to stop
    pause() {
      this.paused = true
    },
    resume() {
      this.paused = false
    },
    stop() {
      this.stopped = true
    },
  })
  const focusScope = focusScopeRef.current

  const trapCleanupRef = React.useRef<(() => void) | null>(null)
  const setContainerRef = React.useCallback(
    (node: HTMLElement | null) => {
      // clean up previous trap if any
      if (trapCleanupRef.current) {
        trapCleanupRef.current()
        trapCleanupRef.current = null
      }

      containerRef.current = node

      // set up trap immediately when node is set (not waiting for effect)
      // only on web - native doesn't have document focus events
      if (isWeb && node && enabled && trapped) {
        trapCleanupRef.current = setupFocusTrap(
          node,
          lastFocusedElementRef,
          focusScopeRef.current
        )
      }

      setContainer(node)
    },
    [enabled, trapped]
  )
  const composedRefs = useComposedRefs(forwardedRef, setContainerRef)

  // Clean up trap when trapped becomes false or on unmount
  useIsomorphicLayoutEffect(() => {
    if (!trapped) {
      // immediately invalidate any pending rAFs
      focusScope.stopped = true
      if (trapCleanupRef.current) {
        trapCleanupRef.current()
        trapCleanupRef.current = null
      }
    }
    return () => {
      if (trapCleanupRef.current) {
        trapCleanupRef.current()
        trapCleanupRef.current = null
      }
    }
  }, [trapped, focusScope])

  useAsyncEffect(
    async (signal) => {
      if (!enabled) return
      if (!container) return
      if (forceUnmount) return

      // only reset stopped flag when trap is actually active
      // otherwise a prop change (trapped: true -> false) would reset it
      // and allow a pending rAF to steal focus
      if (trapped) {
        focusScope.stopped = false
      }
      focusScopesStack.add(focusScope)
      const previouslyFocusedElement = document.activeElement as HTMLElement | null
      const hasFocusedCandidate =
        container.contains(previouslyFocusedElement) &&
        previouslyFocusedElement !== null &&
        !isHidden(previouslyFocusedElement, { upTo: container })

      if (!hasFocusedCandidate) {
        const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS)
        container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus)
        container.dispatchEvent(mountEvent)

        if (!mountEvent.defaultPrevented) {
          // wait for idle before focusing to prevent reflows during animations
          if (focusOnIdle) {
            await idle(
              signal,
              typeof focusOnIdle == 'object'
                ? focusOnIdle
                : {
                    // we can't wait too long or else user can take an action and then we focus
                    max: 200,
                    min: typeof focusOnIdle == 'number' ? focusOnIdle : 16,
                  }
            )
          }

          const allCandidates = getTabbableCandidates(container)
          const linkedRemoved = removeLinks(allCandidates)
          const visibleCandidates = linkedRemoved.filter(
            (candidate) => !isHidden(candidate, { upTo: container })
          )

          focusFirst(visibleCandidates, { select: true })

          // Set the lastFocusedElement to the first visible candidate or container
          if (visibleCandidates.length > 0) {
            lastFocusedElementRef.current = visibleCandidates[0]
          } else {
            lastFocusedElementRef.current = container
          }

          // Don't focus the container if no visible candidates were found
          if (
            document.activeElement === previouslyFocusedElement &&
            visibleCandidates.length === 0
          ) {
            focus(container)
          }
        }
      }

      return () => {
        // signal trap to stop before cleanup runs
        focusScope.stop()

        container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus)

        const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS)
        container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus)
        container.dispatchEvent(unmountEvent)
        if (!unmountEvent.defaultPrevented) {
          // check if focus has already moved to a valid element outside this scope
          // (e.g. another component's autoFocus ran during the same commit)
          // if so, respect that focus rather than stealing it back
          const currentFocus = document.activeElement as HTMLElement | null
          const focusHasMovedOutside =
            currentFocus &&
            currentFocus !== document.body &&
            currentFocus !== container &&
            !container.contains(currentFocus)

          if (!focusHasMovedOutside) {
            focus(previouslyFocusedElement ?? document.body, { select: true })
          }
        }
        // we need to remove the listener after we `dispatchEvent`
        container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus)

        focusScopesStack.remove(focusScope)
      }
    },
    [
      enabled,
      container,
      forceUnmount,
      onMountAutoFocus,
      onUnmountAutoFocus,
      focusScope,
      focusOnIdle,
    ]
  )

  // Takes care of looping focus (when tabbing whilst at the edges)
  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent | KeyboardEvent) => {
      if (!trapped) return
      if (!loop) return
      if (focusScope.paused) return
      if (!enabled) return
      if (!container) return

      const isTabKey =
        event.key === 'Tab' && !event.altKey && !event.ctrlKey && !event.metaKey
      const focusedElement = document.activeElement as HTMLElement | null

      if (isTabKey && focusedElement) {
        const [first, last] = getTabbableEdges(container)
        const hasTabbableElementsInside = first && last

        // we can only wrap focus if we have tabbable edges
        if (!hasTabbableElementsInside) {
          if (focusedElement === container) event.preventDefault()
        } else {
          if (!event.shiftKey && focusedElement === last) {
            event.preventDefault()
            if (loop) focus(first, { select: true })
          } else if (event.shiftKey && focusedElement === first) {
            event.preventDefault()
            if (loop) focus(last, { select: true })
          }
        }
      }
    },
    [loop, trapped, focusScope.paused, enabled, container]
  )

  // Add keydown listener directly to the container for focus trap looping
  React.useEffect(() => {
    if (!container) return
    if (!trapped) return
    if (!loop) return
    if (!enabled) return

    const handleKeyDownCapture = (event: KeyboardEvent) => {
      // Only handle Tab key events for focus trap looping
      if (event.key === 'Tab') {
        handleKeyDown(event)
      }
    }

    // Use capture phase to ensure we handle it before other handlers
    container.addEventListener('keydown', handleKeyDownCapture, true)

    return () => {
      container.removeEventListener('keydown', handleKeyDownCapture, true)
    }
  }, [container, trapped, loop, enabled, handleKeyDown])

  const existingOnKeyDown = (scopeProps as any).onKeyDown

  const composedOnKeyDown = React.useCallback(
    (event: React.KeyboardEvent) => {
      existingOnKeyDown?.(event)
      // Don't call handleKeyDown here since we're handling it via addEventListener
    },
    [existingOnKeyDown]
  )

  return {
    ...scopeProps,
    ref: composedRefs,
    onKeyDown: composedOnKeyDown,
  }
}

/* -------------------------------------------------------------------------------------------------
 * Utils
 * -----------------------------------------------------------------------------------------------*/

/**
 * Attempts focusing the first element in a list of candidates.
 * Stops when focus has actually moved.
 */
function focusFirst(candidates: HTMLElement[], { select = false } = {}) {
  const previouslyFocusedElement = document.activeElement
  for (const candidate of candidates) {
    focus(candidate, { select })
    if (document.activeElement !== previouslyFocusedElement) return
  }
}

/**
 * Returns the first and last tabbable elements inside a container.
 */
function getTabbableEdges(container: HTMLElement) {
  const candidates = getTabbableCandidates(container)
  const first = findVisible(candidates, container)
  const last = findVisible(candidates.reverse(), container)

  return [first, last] as const
}

/**
 * Returns a list of potential tabbable candidates.
 *
 * NOTE: This is only a close approximation. For example it doesn't take into account cases like when
 * elements are not visible. This cannot be worked out easily by just reading a property, but rather
 * necessitate runtime knowledge (computed styles, etc). We deal with these cases separately.
 *
 * See: https://developer.mozilla.org/en-US/docs/Web/API/TreeWalker
 * Credit: https://github.com/discord/focus-layers/blob/master/src/util/wrapFocus.tsx#L1
 */
function getTabbableCandidates(container: HTMLElement) {
  const nodes: HTMLElement[] = []
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node: any) => {
      const isHiddenInput = node.tagName === 'INPUT' && node.type === 'hidden'
      if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP
      // `.tabIndex` is not the same as the `tabindex` attribute. It works on the
      // runtime's understanding of tabbability, so this automatically accounts
      // for any kind of element that could be tabbed to.
      return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
    },
  })
  while (walker.nextNode()) nodes.push(walker.currentNode as HTMLElement)
  // we do not take into account the order of nodes with positive `tabIndex` as it
  // hinders accessibility to have tab order different from visual order.
  return nodes
}

/**
 * Returns the first visible element in a list.
 * NOTE: Only checks visibility up to the `container`.
 */
function findVisible(elements: HTMLElement[], container: HTMLElement) {
  for (const element of elements) {
    // we stop checking if it's hidden at the `container` level (excluding)
    if (!isHidden(element, { upTo: container })) return element
  }
}

function isHidden(node: HTMLElement, { upTo }: { upTo?: HTMLElement }) {
  if (getComputedStyle(node).visibility === 'hidden') return true
  while (node) {
    // we stop at `upTo` (excluding it)
    if (upTo !== undefined && node === upTo) return false
    if (getComputedStyle(node).display === 'none') return true
    node = node.parentElement as HTMLElement
  }
  return false
}

function isSelectableInput(
  element: any
): element is FocusableTarget & { select: () => void } {
  return element instanceof HTMLInputElement && 'select' in element
}

function focus(element?: FocusableTarget | null, { select = false } = {}) {
  // only focus if that element is focusable
  if (element?.focus) {
    const previouslyFocusedElement = document.activeElement
    // NOTE: we prevent scrolling on focus, to minimize jarring transitions for users
    try {
      element.focus({ preventScroll: true })
      // only select if its not the same element, it supports selection and we need to select
      if (element !== previouslyFocusedElement && isSelectableInput(element) && select)
        element.select()
    } catch (error) {
      // In some cases focus might fail, ignore silently
    }
  }
}

/* -------------------------------------------------------------------------------------------------
 * FocusScope stack
 * -----------------------------------------------------------------------------------------------*/

const focusScopesStack = createFocusScopesStack()

function createFocusScopesStack() {
  /** A stack of focus scopes, with the active one at the top */
  let stack: FocusScopeAPI[] = []

  return {
    add(focusScope: FocusScopeAPI) {
      // pause the currently active focus scope (at the top of the stack)
      const activeFocusScope = stack[0]
      if (focusScope !== activeFocusScope) {
        activeFocusScope?.pause()
      }
      // remove in case it already exists (because we'll re-add it at the top of the stack)
      stack = arrayRemove(stack, focusScope)
      stack.unshift(focusScope)
    },

    remove(focusScope: FocusScopeAPI) {
      stack = arrayRemove(stack, focusScope)
      stack[0]?.resume()
    },
  }
}

function arrayRemove<T>(array: T[], item: T) {
  const updatedArray = [...array]
  const index = updatedArray.indexOf(item)
  if (index !== -1) {
    updatedArray.splice(index, 1)
  }
  return updatedArray
}

function removeLinks(items: HTMLElement[]) {
  return items.filter((item) => item.tagName !== 'A')
}

export { FocusScope }

export type { FocusScopeProps }
