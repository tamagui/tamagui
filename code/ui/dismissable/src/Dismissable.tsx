// forked from radix-ui
// https://github.com/radix-ui/primitives/blob/cfd8dcba5fa6a0e751486af418d05a7b88a7f541/packages/react/dismissable-layer/src/DismissableLayer.tsx#L324

import { useComposedRefs } from '@tamagui/compose-refs'
import { Slot, TamaguiElement, View, composeEventHandlers } from '@tamagui/core'
import { useEscapeKeydown } from '@tamagui/use-escape-keydown'
import { useEvent } from '@tamagui/use-event'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import type { DismissableBranchProps, DismissableProps } from './DismissableProps'

export function dispatchDiscreteCustomEvent<E extends CustomEvent>(
  target: E['target'],
  event: E
) {
  if (target) ReactDOM.flushSync(() => target.dispatchEvent(event))
}

/* -------------------------------------------------------------------------------------------------
 * Dismissable
 * -----------------------------------------------------------------------------------------------*/

const DISMISSABLE_LAYER_NAME = 'Dismissable'
const CONTEXT_UPDATE = 'dismissable.update'
const POINTER_DOWN_OUTSIDE = 'dismissable.pointerDownOutside'
const FOCUS_OUTSIDE = 'dismissable.focusOutside'

let originalBodyPointerEvents: string

// global layer tracking
const globalLayers = new Set<HTMLElement>()
const layerChangeListeners = new Set<() => void>()

function notifyLayerChange() {
  for (const listener of layerChangeListeners) {
    listener()
  }
}

/**
 * returns the number of active dismissable layers
 * useful for non-React contexts (e.g. escape key handlers)
 */
export function getDismissableLayerCount(): number {
  return globalLayers.size
}

/**
 * debug helper - logs what elements are registered as dismissable layers
 */
export function debugDismissableLayers(): HTMLElement[] {
  const layers = Array.from(globalLayers)
  console.log('[Dismissable] Active layers:', layers.length, layers)
  return layers
}

/**
 * hook that returns true when any dismissable layer is active
 * re-renders when the state changes
 * uses module-level globals, not React context, so works anywhere in tree
 */
export function useHasDismissableLayers(): boolean {
  const [count, setCount] = React.useState(() => globalLayers.size)

  React.useEffect(() => {
    setCount(globalLayers.size)
    const update = () => setCount(globalLayers.size)
    layerChangeListeners.add(update)
    return () => {
      layerChangeListeners.delete(update)
    }
  }, [])

  return count > 0
}

const DismissableContext = React.createContext({
  layers: new Set<HTMLElement>(),
  layersWithOutsidePointerEventsDisabled: new Set<HTMLElement>(),
  branches: new Set<HTMLElement>(),
})

/**
 * hook to check if a DOM element is inside an active dismissable layer
 * useful for custom escape handling - if inside a dismissable, you may want to defer
 */
export function useIsInsideDismissable(ref: React.RefObject<HTMLElement | null>) {
  const context = React.useContext(DismissableContext)
  const [isInside, setIsInside] = React.useState(false)

  React.useEffect(() => {
    const check = () => {
      const el = ref.current
      if (!el) {
        setIsInside(false)
        return
      }
      for (const layer of context.layers) {
        if (layer.contains(el)) {
          setIsInside(true)
          return
        }
      }
      setIsInside(false)
    }

    check()
    document.addEventListener(CONTEXT_UPDATE, check)
    return () => document.removeEventListener(CONTEXT_UPDATE, check)
  }, [context.layers, ref])

  return isInside
}

/**
 * hook to check if there are dismissable layers above a given element
 * returns the count of layers that are ancestors of the element
 */
export function useDismissableLayersAbove(ref: React.RefObject<HTMLElement | null>) {
  const context = React.useContext(DismissableContext)
  const [count, setCount] = React.useState(0)

  React.useEffect(() => {
    const check = () => {
      const el = ref.current
      if (!el) {
        setCount(0)
        return
      }
      let above = 0
      for (const layer of context.layers) {
        if (layer.contains(el)) {
          above++
        }
      }
      setCount(above)
    }

    check()
    document.addEventListener(CONTEXT_UPDATE, check)
    return () => document.removeEventListener(CONTEXT_UPDATE, check)
  }, [context.layers, ref])

  return count
}

const Dismissable = React.forwardRef<
  HTMLElement,
  DismissableProps & { asChild?: boolean }
>((props, forwardedRef) => {
  const {
    disableOutsidePointerEvents = false,
    forceUnmount,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    onDismiss,
    asChild,
    children,
    ...layerProps
  } = props
  const Comp = asChild ? Slot : View
  const context = React.useContext(DismissableContext)
  const [node, setNode] = React.useState<HTMLElement | null>(null)
  const [, force] = React.useState({})
  const composedRefs = useComposedRefs(forwardedRef, (node) => setNode(node))
  const layers = Array.from(context.layers)

  const [highestLayerWithOutsidePointerEventsDisabled] = [
    ...context.layersWithOutsidePointerEventsDisabled,
  ].slice(-1)
  const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(
    highestLayerWithOutsidePointerEventsDisabled
  )

  const index = node ? layers.indexOf(node) : -1
  const isBodyPointerEventsDisabled =
    context.layersWithOutsidePointerEventsDisabled.size > 0
  const isPointerEventsEnabled =
    index >= highestLayerWithOutsidePointerEventsDisabledIndex

  const pointerDownOutside = usePointerDownOutside((event) => {
    const target = event.target as HTMLElement
    const isPointerDownOnBranch = [...context.branches].some((branch) =>
      branch.contains(target)
    )
    if (!isPointerEventsEnabled || isPointerDownOnBranch) return
    onPointerDownOutside?.(event)
    onInteractOutside?.(event)
    if (!event.defaultPrevented) onDismiss?.()
  })

  const focusOutside = useFocusOutside((event) => {
    const target = event.target as HTMLElement
    const isFocusInBranch = [...context.branches].some((branch) =>
      branch.contains(target)
    )
    if (isFocusInBranch) return
    onFocusOutside?.(event)
    onInteractOutside?.(event)
    if (!event.defaultPrevented) onDismiss?.()
  })

  // track forceUnmount in a ref so escape handler can check it
  const forceUnmountRef = React.useRef(forceUnmount)
  React.useEffect(() => {
    forceUnmountRef.current = forceUnmount
  }, [forceUnmount])

  useEscapeKeydown((event) => {
    // skip if this layer is force-unmounted (e.g. dialog closed but still mounted)
    if (forceUnmountRef.current) return
    // Check layers at callback time, not render time, to avoid stale closures
    const currentLayers = Array.from(context.layers)
    const currentIndex = node ? currentLayers.indexOf(node) : -1
    const isHighestLayer = currentIndex === currentLayers.length - 1
    if (!isHighestLayer) return
    onEscapeKeyDown?.(event)
    if (!event.defaultPrevented && onDismiss) {
      event.preventDefault()
      onDismiss()
    }
  })

  React.useEffect(() => {
    if (!node) return
    // don't add to layers when force-unmounted (dialog closed but still mounted)
    if (forceUnmount) return
    if (disableOutsidePointerEvents) {
      if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
        originalBodyPointerEvents = document.body.style.pointerEvents
        document.body.style.pointerEvents = 'none'
      }
      context.layersWithOutsidePointerEventsDisabled.add(node)
    }
    context.layers.add(node)
    globalLayers.add(node)
    dispatchUpdate()
    notifyLayerChange()
    return () => {
      if (
        disableOutsidePointerEvents &&
        context.layersWithOutsidePointerEventsDisabled.size === 1
      ) {
        document.body.style.pointerEvents = originalBodyPointerEvents
      }
    }
  }, [node, disableOutsidePointerEvents, forceUnmount, context])

  /**
   * We purposefully prevent combining this effect with the `disableOutsidePointerEvents` effect
   * because a change to `disableOutsidePointerEvents` would remove this layer from the stack
   * and add it to the end again so the layering order wouldn't be _creation order_.
   * We only want them to be removed from context stacks when unmounted.
   */
  React.useEffect(() => {
    if (forceUnmount) return
    return () => {
      if (!node) return
      context.layers.delete(node)
      context.layersWithOutsidePointerEventsDisabled.delete(node)
      globalLayers.delete(node)
      dispatchUpdate()
      notifyLayerChange()
    }
  }, [node, context, forceUnmount])

  React.useEffect(() => {
    const handleUpdate = () => {
      force({})
    }
    document.addEventListener(CONTEXT_UPDATE, handleUpdate)
    return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate)
  }, [])

  return (
    <Comp
      {...layerProps}
      // @ts-ignore
      ref={composedRefs}
      {...(!asChild && {
        display: 'contents',
      })}
      pointerEvents={
        isBodyPointerEventsDisabled
          ? isPointerEventsEnabled
            ? 'auto'
            : 'none'
          : undefined
      }
      onFocusCapture={composeEventHandlers(
        props.onFocusCapture,
        focusOutside.onFocusCapture
      )}
      onBlurCapture={composeEventHandlers(
        props.onBlurCapture,
        focusOutside.onBlurCapture
      )}
      onPointerDownCapture={composeEventHandlers(
        props.onPointerDownCapture,
        pointerDownOutside.onPointerDownCapture
      )}
    >
      {children}
    </Comp>
  )
})

Dismissable.displayName = DISMISSABLE_LAYER_NAME

/* -------------------------------------------------------------------------------------------------
 * DismissableBranch
 * -----------------------------------------------------------------------------------------------*/

const BRANCH_NAME = 'DismissableBranch'

const DismissableBranch = React.forwardRef<TamaguiElement, DismissableBranchProps>(
  (props, forwardedRef) => {
    const context = React.useContext(DismissableContext)
    const ref = React.useRef<TamaguiElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)

    React.useEffect(() => {
      const node = ref.current
      if (!(node instanceof HTMLElement)) return
      if (node) {
        context.branches.add(node)
        return () => {
          context.branches.delete(node)
        }
      }
    }, [context.branches])

    return <View asChild="except-style" {...props} ref={composedRefs} />
  }
)

DismissableBranch.displayName = BRANCH_NAME

/* -----------------------------------------------------------------------------------------------*/

export type PointerDownOutsideEvent = CustomEvent<{ originalEvent: PointerEvent }>
export type FocusOutsideEvent = CustomEvent<{ originalEvent: FocusEvent }>

/**
 * Listens for `pointerdown` outside a react subtree. We use `pointerdown` rather than `pointerup`
 * to mimic layer dismissing behaviour present in OS.
 * Returns props to pass to the node we want to check for outside events.
 */
function usePointerDownOutside(
  onPointerDownOutside?: (event: PointerDownOutsideEvent) => void
) {
  const handlePointerDownOutside = useEvent(onPointerDownOutside) as EventListener
  const isPointerInsideReactTreeRef = React.useRef(false)
  const handleClickRef = React.useRef(() => {})

  React.useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.target && !isPointerInsideReactTreeRef.current) {
        const eventDetail = { originalEvent: event }

        function handleAndDispatchPointerDownOutsideEvent() {
          handleAndDispatchCustomEvent(
            POINTER_DOWN_OUTSIDE,
            handlePointerDownOutside,
            eventDetail,
            { discrete: true }
          )
        }

        /**
         * On touch devices, we need to wait for a click event because browsers implement
         * a ~350ms delay between the time the user stops touching the display and when the
         * browser executres events. We need to ensure we don't reactivate pointer-events within
         * this timeframe otherwise the browser may execute events that should have been prevented.
         *
         * Additionally, this also lets us deal automatically with cancellations when a click event
         * isn't raised because the page was considered scrolled/drag-scrolled, long-pressed, etc.
         *
         * This is why we also continuously remove the previous listener, because we cannot be
         * certain that it was raised, and therefore cleaned-up.
         */
        if (event.pointerType === 'touch') {
          document.removeEventListener('click', handleClickRef.current)
          handleClickRef.current = handleAndDispatchPointerDownOutsideEvent
          document.addEventListener('click', handleClickRef.current, { once: true })
        } else {
          handleAndDispatchPointerDownOutsideEvent()
        }
      }
      isPointerInsideReactTreeRef.current = false
    }
    /**
     * if this hook executes in a component that mounts via a `pointerdown` event, the event
     * would bubble up to the document and trigger a `pointerDownOutside` event. We avoid
     * this by delaying the event listener registration on the document.
     * This is not React specific, but rather how the DOM works, ie:
     * ```
     * button.addEventListener('pointerdown', () => {
     *   console.log('I will log');
     *   document.addEventListener('pointerdown', () => {
     *     console.log('I will also log');
     *   })
     * });
     */
    const timerId = setTimeout(() => {
      document.addEventListener('pointerdown', handlePointerDown)
    }, 0)
    return () => {
      window.clearTimeout(timerId)
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('click', handleClickRef.current)
    }
  }, [handlePointerDownOutside])

  return {
    // ensures we check React component tree (not just DOM tree)
    onPointerDownCapture: () => {
      isPointerInsideReactTreeRef.current = true
    },
  }
}

/**
 * Listens for when focus happens outside a react subtree.
 * Returns props to pass to the root (node) of the subtree we want to check.
 */
function useFocusOutside(onFocusOutside?: (event: FocusOutsideEvent) => void) {
  const handleFocusOutside = useEvent(onFocusOutside) as EventListener
  const isFocusInsideReactTreeRef = React.useRef(false)

  React.useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      if (event.target && !isFocusInsideReactTreeRef.current) {
        const eventDetail = { originalEvent: event }
        handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
          discrete: false,
        })
      }
    }
    document.addEventListener('focusin', handleFocus)
    return () => document.removeEventListener('focusin', handleFocus)
  }, [handleFocusOutside])

  return {
    onFocusCapture: () => {
      isFocusInsideReactTreeRef.current = true
    },
    onBlurCapture: () => {
      isFocusInsideReactTreeRef.current = false
    },
  }
}

function dispatchUpdate() {
  const event = new CustomEvent(CONTEXT_UPDATE)
  document.dispatchEvent(event)
}

function handleAndDispatchCustomEvent<E extends CustomEvent, OriginalEvent extends Event>(
  name: string,
  handler: ((event: E) => void) | undefined,
  detail: { originalEvent: OriginalEvent } & (E extends CustomEvent<infer D> ? D : never),
  { discrete }: { discrete: boolean }
) {
  const target = detail.originalEvent.target
  const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail })
  if (handler) target.addEventListener(name, handler as EventListener, { once: true })

  if (discrete) {
    dispatchDiscreteCustomEvent(target, event)
  } else {
    target.dispatchEvent(event)
  }
}

export { Dismissable, DismissableBranch }

export type { DismissableProps }
