import { AnimatePresence, useIsPresent } from '@tamagui/animate-presence'
import { createCollection } from '@tamagui/collection'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  GetProps,
  Stack,
  TamaguiElement,
  Text,
  composeEventHandlers,
  isWeb,
  styled,
  themeable,
  useEvent,
  useId,
  useIsomorphicLayoutEffect,
  withStaticProperties,
} from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import {
  Dismissable,
  DismissableProps,
  dispatchDiscreteCustomEvent,
} from '@tamagui/dismissable'
import { Portal } from '@tamagui/portal'
import { ThemeableStack, YStack } from '@tamagui/stacks'
import { Paragraph, SizableText } from '@tamagui/text'
import { useControllableState } from '@tamagui/use-controllable-state'
import { VisuallyHidden } from '@tamagui/visually-hidden'
import { ToastOptions as BurntToastOptions } from 'burnt/build/types'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { createNativeToast } from './createNativeToast'

/* -------------------------------------------------------------------------------------------------
 * ToastViewport
 * -----------------------------------------------------------------------------------------------*/

const VIEWPORT_NAME = 'ToastViewport'
const VIEWPORT_DEFAULT_HOTKEY = ['F8']
const VIEWPORT_PAUSE = 'toast.viewportPause'
const VIEWPORT_RESUME = 'toast.viewportResume'

const ToastViewportFrame = styled(Stack, {
  name: VIEWPORT_NAME,
})
type ToastViewportFrameProps = GetProps<typeof ToastViewportFrame>
type ToastViewportProps = ToastViewportFrameProps & {
  /**
   * The keys to use as the keyboard shortcut that will move focus to the toast viewport.
   * @defaultValue ['F8']
   */
  hotkey?: string[]
  /**
   * An author-localized label for the toast viewport to provide context for screen reader users
   * when navigating page landmarks. The available `{hotkey}` placeholder will be replaced for you.
   * @defaultValue 'Notifications ({hotkey})'
   */
  label?: string
}

const ToastViewport = React.forwardRef<HTMLDivElement, ToastViewportProps>(
  (props: ScopedProps<ToastViewportProps>, forwardedRef) => {
    const {
      __scopeToast,
      hotkey = VIEWPORT_DEFAULT_HOTKEY,
      label = 'Notifications ({hotkey})',
      ...viewportProps
    } = props
    const context = useToastProviderContext(VIEWPORT_NAME, __scopeToast)
    const getItems = useCollection(__scopeToast)
    const wrapperRef = React.useRef<HTMLDivElement>(null)
    const headFocusProxyRef = React.useRef<FocusProxyElement>(null)
    const tailFocusProxyRef = React.useRef<FocusProxyElement>(null)
    const ref = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref, context.onViewportChange)
    const hotkeyLabel = hotkey.join('+').replace(/Key/g, '').replace(/Digit/g, '')
    const hasToasts = context.toastCount > 0

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        // we use `event.code` as it is consistent regardless of meta keys that were pressed.
        // for example, `event.key` for `Control+Alt+t` is `†` and `t !== †`
        const isHotkeyPressed = hotkey.every(
          (key) => (event as any)[key] || event.code === key
        )
        if (isHotkeyPressed) ref.current?.focus()
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [hotkey])

    React.useEffect(() => {
      const wrapper = wrapperRef.current
      const viewport = ref.current
      if (hasToasts && wrapper && viewport) {
        const handlePause = () => {
          if (!context.isClosePausedRef.current) {
            const pauseEvent = new CustomEvent(VIEWPORT_PAUSE)
            viewport.dispatchEvent(pauseEvent)
            context.isClosePausedRef.current = true
          }
        }

        const handleResume = () => {
          if (context.isClosePausedRef.current) {
            const resumeEvent = new CustomEvent(VIEWPORT_RESUME)
            viewport.dispatchEvent(resumeEvent)
            context.isClosePausedRef.current = false
          }
        }

        const handleFocusOutResume = (event: FocusEvent) => {
          const isFocusMovingOutside = !wrapper.contains(
            event.relatedTarget as HTMLElement
          )
          if (isFocusMovingOutside) handleResume()
        }

        const handlePointerLeaveResume = () => {
          const isFocusInside = wrapper.contains(document.activeElement)
          if (!isFocusInside) handleResume()
        }
        // Toasts are not in the viewport React tree so we need to bind DOM events
        wrapper.addEventListener('focusin', handlePause)
        wrapper.addEventListener('focusout', handleFocusOutResume)
        wrapper.addEventListener('pointermove', handlePause)
        wrapper.addEventListener('pointerleave', handlePointerLeaveResume)
        window.addEventListener('blur', handlePause)
        window.addEventListener('focus', handleResume)
        return () => {
          wrapper.removeEventListener('focusin', handlePause)
          wrapper.removeEventListener('focusout', handleFocusOutResume)
          wrapper.removeEventListener('pointermove', handlePause)
          wrapper.removeEventListener('pointerleave', handlePointerLeaveResume)
          window.removeEventListener('blur', handlePause)
          window.removeEventListener('focus', handleResume)
        }
      }
    }, [hasToasts, context.isClosePausedRef])

    const getSortedTabbableCandidates = React.useCallback(
      ({ tabbingDirection }: { tabbingDirection: 'forwards' | 'backwards' }) => {
        const toastItems = getItems()
        const tabbableCandidates = toastItems.map((toastItem) => {
          const toastNode = toastItem.ref.current!
          const toastTabbableCandidates = [toastNode, ...getTabbableCandidates(toastNode)]
          return tabbingDirection === 'forwards'
            ? toastTabbableCandidates
            : toastTabbableCandidates.reverse()
        })
        return (
          tabbingDirection === 'forwards'
            ? tabbableCandidates.reverse()
            : tabbableCandidates
        ).flat()
      },
      [getItems]
    )

    React.useEffect(() => {
      const viewport = ref.current
      // We programmatically manage tabbing as we are unable to influence
      // the source order with portals, this allows us to reverse the
      // tab order so that it runs from most recent toast to least
      if (viewport) {
        const handleKeyDown = (event: KeyboardEvent) => {
          const isMetaKey = event.altKey || event.ctrlKey || event.metaKey
          const isTabKey = event.key === 'Tab' && !isMetaKey

          if (isTabKey) {
            const focusedElement = document.activeElement
            const isTabbingBackwards = event.shiftKey
            const targetIsViewport = event.target === viewport

            // If we're back tabbing after jumping to the viewport then we simply
            // proxy focus out to the preceding document
            if (targetIsViewport && isTabbingBackwards) {
              headFocusProxyRef.current?.focus()
              return
            }

            const tabbingDirection = isTabbingBackwards ? 'backwards' : 'forwards'
            const sortedCandidates = getSortedTabbableCandidates({ tabbingDirection })
            const index = sortedCandidates.findIndex(
              (candidate) => candidate === focusedElement
            )
            if (focusFirst(sortedCandidates.slice(index + 1))) {
              event.preventDefault()
            } else {
              // If we can't focus that means we're at the edges so we
              // proxy to the corresponding exit point and let the browser handle
              // tab/shift+tab keypress and implicitly pass focus to the next valid element in the document
              isTabbingBackwards
                ? headFocusProxyRef.current?.focus()
                : tailFocusProxyRef.current?.focus()
            }
          }
        }

        // Toasts are not in the viewport React tree so we need to bind DOM events
        viewport.addEventListener('keydown', handleKeyDown)
        return () => viewport.removeEventListener('keydown', handleKeyDown)
      }
    }, [getItems, getSortedTabbableCandidates])

    return (
      <>
        {hasToasts && (
          <FocusProxy
            ref={headFocusProxyRef}
            onFocusFromOutsideViewport={() => {
              const tabbableCandidates = getSortedTabbableCandidates({
                tabbingDirection: 'forwards',
              })
              focusFirst(tabbableCandidates)
            }}
          />
        )}
        {/**
         * tabindex on the the list so that it can be focused when items are removed. we focus
         * the list instead of the viewport so it announces number of items remaining.
         */}
        <Collection.Slot scope={__scopeToast}>
          <ToastViewportFrame tabIndex={-1} {...viewportProps} ref={composedRefs} />
        </Collection.Slot>
        {hasToasts && (
          <FocusProxy
            ref={tailFocusProxyRef}
            onFocusFromOutsideViewport={() => {
              const tabbableCandidates = getSortedTabbableCandidates({
                tabbingDirection: 'backwards',
              })
              focusFirst(tabbableCandidates)
            }}
          />
        )}
      </>
    )
  }
)

ToastViewport.displayName = VIEWPORT_NAME

/* -----------------------------------------------------------------------------------------------*/

const FOCUS_PROXY_NAME = 'ToastFocusProxy'

type FocusProxyElement = React.ElementRef<typeof VisuallyHidden>
type VisuallyHiddenProps = GetProps<typeof VisuallyHidden>
interface FocusProxyProps extends VisuallyHiddenProps {
  onFocusFromOutsideViewport(): void
}

const FocusProxy = React.forwardRef<FocusProxyElement, ScopedProps<FocusProxyProps>>(
  (props, forwardedRef) => {
    const { __scopeToast, onFocusFromOutsideViewport, ...proxyProps } = props
    const context = useToastProviderContext(FOCUS_PROXY_NAME, __scopeToast)

    return (
      <VisuallyHidden
        aria-hidden
        tabIndex={0}
        {...proxyProps}
        ref={forwardedRef}
        // Avoid page scrolling when focus is on the focus proxy
        style={{ position: 'fixed' }}
        onFocus={(event) => {
          const prevFocusedElement = event.relatedTarget as HTMLElement | null
          const isFocusFromOutsideViewport =
            !context.viewport?.contains(prevFocusedElement)
          if (isFocusFromOutsideViewport) onFocusFromOutsideViewport()
        }}
      />
    )
  }
)

FocusProxy.displayName = FOCUS_PROXY_NAME

/* -------------------------------------------------------------------------------------------------
 * ToastTitle
 * -----------------------------------------------------------------------------------------------*/

const TITLE_NAME = 'ToastTitle'

const ToastTitleFrame = styled(SizableText, {
  name: TITLE_NAME,
  variants: {
    unstyled: {
      false: {
        size: '$6',
      },
    },
  },
  defaultVariants: {
    unstyled: false,
  },
})
type PrimitiveDivProps = GetProps<typeof ToastTitleFrame>
type ToastTitleProps = PrimitiveDivProps & {}

const ToastTitle = React.forwardRef<TamaguiElement, ToastTitleProps>(
  (props: ScopedProps<ToastTitleProps>, forwardedRef) => {
    const { __scopeToast, ...titleProps } = props
    return <ToastTitleFrame {...titleProps} ref={forwardedRef} />
  }
)

ToastTitle.displayName = TITLE_NAME

/* -------------------------------------------------------------------------------------------------
 * ToastDescription
 * -----------------------------------------------------------------------------------------------*/

const DESCRIPTION_NAME = 'ToastDescription'

const ToastDescriptionFrame = styled(Paragraph, {
  name: DESCRIPTION_NAME,
})
type ToastDescriptionFrameProps = GetProps<typeof ToastDescriptionFrame>
type ToastDescriptionProps = ToastDescriptionFrameProps & {}

const ToastDescription = React.forwardRef<TamaguiElement, ToastDescriptionProps>(
  (props: ScopedProps<ToastDescriptionProps>, forwardedRef) => {
    const { __scopeToast, ...descriptionProps } = props
    return <ToastDescriptionFrame {...descriptionProps} ref={forwardedRef} />
  }
)

ToastDescription.displayName = DESCRIPTION_NAME

/* -------------------------------------------------------------------------------------------------
 * ToastAction
 * -----------------------------------------------------------------------------------------------*/

const ACTION_NAME = 'ToastAction'

type ToastActionProps = ToastCloseProps & {
  /**
   * A short description for an alternate way to carry out the action. For screen reader users
   * who will not be able to navigate to the button easily/quickly.
   * @example <ToastAction altText="Goto account settings to updgrade">Upgrade</ToastAction>
   * @example <ToastAction altText="Undo (Alt+U)">Undo</ToastAction>
   */
  altText: string
}

const ToastAction = React.forwardRef<TamaguiElement, ToastActionProps>(
  (props: ScopedProps<ToastActionProps>, forwardedRef) => {
    const { altText, ...actionProps } = props
    if (!altText) return null
    return (
      <ToastAnnounceExclude altText={altText} asChild>
        <ToastClose {...actionProps} ref={forwardedRef} />
      </ToastAnnounceExclude>
    )
  }
)

ToastAction.propTypes = {
  altText(props) {
    if (!props.altText) {
      return new Error(`Missing prop \`altText\` expected on \`${ACTION_NAME}\``)
    }
    return null
  },
}

ToastAction.displayName = ACTION_NAME

/* -------------------------------------------------------------------------------------------------
 * ToastClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'ToastClose'

const ToastCloseFrame = styled(YStack, {
  name: CLOSE_NAME,
  tag: 'button',
})
type ToastCloseFrameProps = GetProps<typeof ToastCloseFrame>
type ToastCloseProps = ToastCloseFrameProps & {}

const ToastClose = React.forwardRef<TamaguiElement, ToastCloseProps>(
  (props: ScopedProps<ToastCloseProps>, forwardedRef) => {
    const { __scopeToast, ...closeProps } = props
    const interactiveContext = useToastInteractiveContext(CLOSE_NAME, __scopeToast)

    return (
      <ToastAnnounceExclude asChild>
        <ToastCloseFrame
          accessibilityLabel="Dialog Close"
          {...closeProps}
          ref={forwardedRef}
          onPress={composeEventHandlers(props.onPress as any, interactiveContext.onClose)}
        />
      </ToastAnnounceExclude>
    )
  }
)

ToastClose.displayName = CLOSE_NAME

/* ---------------------------------------------------------------------------------------------- */

const ToastAnnounceExcludeFrame = styled(Stack, {
  name: 'ToastAnnounceExclude',
})
type ToastAnnounceExcludeFrameProps = GetProps<typeof ToastAnnounceExcludeFrame>
type ToastAnnounceExcludeProps = ToastAnnounceExcludeFrameProps & {
  altText?: string
}

const ToastAnnounceExclude = React.forwardRef<TamaguiElement, ToastAnnounceExcludeProps>(
  (props: ScopedProps<ToastAnnounceExcludeProps>, forwardedRef) => {
    const { __scopeToast, altText, ...announceExcludeProps } = props

    return (
      <ToastAnnounceExcludeFrame
        data-toast-announce-exclude=""
        data-toast-announce-alt={altText || undefined}
        {...announceExcludeProps}
        ref={forwardedRef}
      />
    )
  }
)

function getAnnounceTextContent(container: HTMLElement) {
  const textContent: string[] = []
  const childNodes = Array.from(container.childNodes)

  childNodes.forEach((node) => {
    if (node.nodeType === node.TEXT_NODE && node.textContent)
      textContent.push(node.textContent)
    if (isHTMLElement(node)) {
      const isHidden = node.ariaHidden || node.hidden || node.style.display === 'none'
      const isExcluded = node.dataset.toastAnnounceExclude === ''

      if (!isHidden) {
        if (isExcluded) {
          const altText = node.dataset.toastAnnounceAlt
          if (altText) textContent.push(altText)
        } else {
          textContent.push(...getAnnounceTextContent(node))
        }
      }
    }
  })

  // We return a collection of text rather than a single concatenated string.
  // This allows SR VO to naturally pause break between nodes while announcing.
  return textContent
}

/* -------------------------------------------------------------------------------------------------
 * ToastProvider
 * -----------------------------------------------------------------------------------------------*/

const PROVIDER_NAME = 'ToastProvider'

const [Collection, useCollection, createCollectionScope] =
  createCollection<TamaguiElement>('Toast')

type SwipeDirection = 'up' | 'down' | 'left' | 'right'
type ToastProviderContextValue = {
  label: string
  duration: number
  swipeDirection: SwipeDirection
  swipeThreshold: number
  toastCount: number
  viewport: TamaguiElement | null
  onViewportChange(viewport: TamaguiElement): void
  onToastAdd(): void
  onToastRemove(): void
  isFocusedToastEscapeKeyDownRef: React.MutableRefObject<boolean>
  isClosePausedRef: React.MutableRefObject<boolean>
}

type ScopedProps<P> = P & { __scopeToast?: Scope }
const [createToastContext, createToastScope] = createContextScope('Toast', [
  createCollectionScope,
])
const [ToastProviderProvider, useToastProviderContext] =
  createToastContext<ToastProviderContextValue>(PROVIDER_NAME)

interface ToastProviderProps {
  children?: React.ReactNode
  /**
   * An author-localized label for each toast. Used to help screen reader users
   * associate the interruption with a toast.
   * @defaultValue 'Notification'
   */
  label?: string
  /**
   * Time in milliseconds that each toast should remain visible for.
   * @defaultValue 5000
   */
  duration?: number
  /**
   * Direction of pointer swipe that should close the toast.
   * @defaultValue 'right'
   */
  swipeDirection?: SwipeDirection
  /**
   * Distance in pixels that the swipe must pass before a close is triggered.
   * @defaultValue 50
   */
  swipeThreshold?: number
}

const ToastProvider: React.FC<ToastProviderProps> = (
  props: ScopedProps<ToastProviderProps>
) => {
  const {
    __scopeToast,
    label = 'Notification',
    duration = 5000,
    swipeDirection = 'right',
    swipeThreshold = 50,
    children,
  } = props
  const [viewport, setViewport] = React.useState<TamaguiElement | null>(null)
  const [toastCount, setToastCount] = React.useState(0)
  const isFocusedToastEscapeKeyDownRef = React.useRef(false)
  const isClosePausedRef = React.useRef(false)

  return (
    <Collection.Provider scope={__scopeToast}>
      <ToastProviderProvider
        scope={__scopeToast}
        label={label}
        duration={duration}
        swipeDirection={swipeDirection}
        swipeThreshold={swipeThreshold}
        toastCount={toastCount}
        viewport={viewport}
        onViewportChange={setViewport}
        onToastAdd={React.useCallback(() => {
          setToastCount((prevCount) => prevCount + 1)
        }, [])}
        onToastRemove={React.useCallback(() => {
          setToastCount((prevCount) => prevCount - 1)
        }, [])}
        isFocusedToastEscapeKeyDownRef={isFocusedToastEscapeKeyDownRef}
        isClosePausedRef={isClosePausedRef}
      >
        {children}
      </ToastProviderProvider>
    </Collection.Provider>
  )
}

ToastProvider.propTypes = {
  label(props) {
    if (props.label && typeof props.label === 'string' && !props.label.trim()) {
      const error = `Invalid prop \`label\` supplied to \`${PROVIDER_NAME}\`. Expected non-empty \`string\`.`
      return new Error(error)
    }
    return null
  },
}

ToastProvider.displayName = PROVIDER_NAME

/* -------------------------------------------------------------------------------------------------
 * Toast
 * -----------------------------------------------------------------------------------------------*/

const TOAST_NAME = 'Toast'
const TOAST_SWIPE_START = 'toast.swipeStart'
const TOAST_SWIPE_MOVE = 'toast.swipeMove'
const TOAST_SWIPE_CANCEL = 'toast.swipeCancel'
const TOAST_SWIPE_END = 'toast.swipeEnd'

const ToastImplFrame = styled(ThemeableStack, {
  name: 'ToastImpl',
  variants: {
    backgrounded: {
      true: {
        backgroundColor: '$color6',
      },
    },
  },
  defaultVariants: {
    backgrounded: true,
  },
})
interface ToastProps extends Omit<ToastImplProps, keyof ToastImplPrivateProps> {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?(open: boolean): void
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const ToastComponent = React.forwardRef<TamaguiElement, ToastProps>(
  ToastImplFrame.extractable((props: ScopedProps<ToastProps>, forwardedRef) => {
    const { forceMount, open: openProp, defaultOpen, onOpenChange, ...toastProps } = props
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? true,
      onChange: onOpenChange,
    })

    const id = useId()
    const onPause = useEvent(props.onPause)
    const onResume = useEvent(props.onResume)

    return (
      <AnimatePresence>
        {(forceMount || open) && (
          <ToastImpl
            key={id}
            open={open}
            {...toastProps}
            ref={forwardedRef}
            onClose={() => setOpen(false)}
            onPause={onPause}
            onResume={onResume}
            onSwipeStart={composeEventHandlers(props.onSwipeStart, (event) => {
              event.currentTarget.
              event.currentTarget.setAttribute('data-swipe', 'start')
            })}
            onSwipeMove={composeEventHandlers(props.onSwipeMove, (event) => {
              const { x, y } = event.detail.delta
              event.currentTarget.setAttribute('data-swipe', 'move')
              event.currentTarget.style.setProperty('--toast-swipe-move-x', `${x}px`)
              event.currentTarget.style.setProperty('--toast-swipe-move-y', `${y}px`)
            })}
            onSwipeCancel={composeEventHandlers(props.onSwipeCancel, (event) => {
              event.currentTarget.setAttribute('data-swipe', 'cancel')
              event.currentTarget.style.removeProperty('--toast-swipe-move-x')
              event.currentTarget.style.removeProperty('--toast-swipe-move-y')
              event.currentTarget.style.removeProperty('--toast-swipe-end-x')
              event.currentTarget.style.removeProperty('--toast-swipe-end-y')
            })}
            onSwipeEnd={composeEventHandlers(props.onSwipeEnd, (event) => {
              const { x, y } = event.detail.delta
              event.currentTarget.setAttribute('data-swipe', 'end')
              event.currentTarget.style.removeProperty('--toast-swipe-move-x')
              event.currentTarget.style.removeProperty('--toast-swipe-move-y')
              event.currentTarget.style.setProperty('--toast-swipe-end-x', `${x}px`)
              event.currentTarget.style.setProperty('--toast-swipe-end-y', `${y}px`)
              setOpen(false)
            })}
          />
        )}
      </AnimatePresence>
    )
  })
)

ToastComponent.displayName = TOAST_NAME

const Toast = withStaticProperties(
  themeable(ToastComponent, ToastImplFrame.staticConfig),
  {
    Viewport: ToastViewport,
    Title: ToastTitle,
    Description: ToastDescription,
    Action: ToastAction,
    Close: ToastClose,
  }
)

/* -----------------------------------------------------------------------------------------------*/

type SwipeEvent = { currentTarget: EventTarget & TamaguiElement } & Omit<
  CustomEvent<{ originalEvent: React.PointerEvent; delta: { x: number; y: number } }>,
  'currentTarget'
>

const [ToastInteractiveProvider, useToastInteractiveContext] = createToastContext(
  TOAST_NAME,
  {
    onClose() {},
  }
)

type ToastImplPrivateProps = { open: boolean; onClose(): void }
type ToastImplFrameProps = GetProps<typeof ToastImplFrame>
type ToastImplProps = ToastImplPrivateProps &
  ToastImplFrameProps & {
    type?: 'foreground' | 'background'
    /**
     * Time in milliseconds that toast should remain visible for. Overrides value
     * given to `ToastProvider`.
     */
    duration?: number
    onEscapeKeyDown?: DismissableProps['onEscapeKeyDown']
    onPause?(): void
    onResume?(): void
    onSwipeStart?(event: SwipeEvent): void
    onSwipeMove?(event: SwipeEvent): void
    onSwipeCancel?(event: SwipeEvent): void
    onSwipeEnd?(event: SwipeEvent): void
  }

const ToastImpl = React.forwardRef<TamaguiElement, ToastImplProps>(
  (props: ScopedProps<ToastImplProps>, forwardedRef) => {
    const {
      __scopeToast,
      type = 'foreground',
      duration: durationProp,
      open,
      onClose,
      onEscapeKeyDown,
      onPause,
      onResume,
      onSwipeStart,
      onSwipeMove,
      onSwipeCancel,
      onSwipeEnd,
      ...toastProps
    } = props
    const isPresent = useIsPresent()
    const context = useToastProviderContext(TOAST_NAME, __scopeToast)
    const [node, setNode] = React.useState<HTMLElement | null>(null)
    const composedRefs = useComposedRefs(forwardedRef, (node) => setNode(node))
    const pointerStartRef = React.useRef<{ x: number; y: number } | null>(null)
    const swipeDeltaRef = React.useRef<{ x: number; y: number } | null>(null)
    const duration = durationProp || context.duration
    const closeTimerStartTimeRef = React.useRef(0)
    const closeTimerRemainingTimeRef = React.useRef(duration)
    const closeTimerRef = React.useRef(0)
    const { onToastAdd, onToastRemove } = context
    const handleClose = useEvent(() => {
      if (!isPresent) {
        // already removed from the react tree
        return
      }
      // focus viewport if focus is within toast to read the remaining toast
      // count to SR users and ensure focus isn't lost
      const isFocusInToast = node?.contains(document.activeElement)
      if (isFocusInToast) context.viewport?.focus()
      onClose()
    })

    const startTimer = React.useCallback(
      (duration: number) => {
        if (!duration || duration === Infinity) return
        window.clearTimeout(closeTimerRef.current)
        closeTimerStartTimeRef.current = new Date().getTime()
        closeTimerRef.current = window.setTimeout(handleClose, duration)
      },
      [handleClose]
    )

    React.useEffect(() => {
      const viewport = context.viewport
      if (viewport) {
        const handleResume = () => {
          startTimer(closeTimerRemainingTimeRef.current)
          onResume?.()
        }
        const handlePause = () => {
          const elapsedTime = new Date().getTime() - closeTimerStartTimeRef.current
          closeTimerRemainingTimeRef.current =
            closeTimerRemainingTimeRef.current - elapsedTime
          window.clearTimeout(closeTimerRef.current)
          onPause?.()
        }
        viewport.addEventListener(VIEWPORT_PAUSE, handlePause)
        viewport.addEventListener(VIEWPORT_RESUME, handleResume)
        return () => {
          viewport.removeEventListener(VIEWPORT_PAUSE, handlePause)
          viewport.removeEventListener(VIEWPORT_RESUME, handleResume)
        }
      }
    }, [context.viewport, duration, onPause, onResume, startTimer])

    // start timer when toast opens or duration changes.
    // we include `open` in deps because closed !== unmounted when animating
    // so it could reopen before being completely unmounted
    React.useEffect(() => {
      if (open && !context.isClosePausedRef.current) {
        startTimer(duration)
      }
    }, [open, duration, context.isClosePausedRef, startTimer])

    React.useEffect(() => {
      onToastAdd()
      return () => onToastRemove()
    }, [onToastAdd, onToastRemove])

    const announceTextContent = React.useMemo(() => {
      return node ? getAnnounceTextContent(node) : null
    }, [node])

    if (!context.viewport) return null
    return (
      <>
        {announceTextContent && (
          <ToastAnnounce
            __scopeToast={__scopeToast}
            // Toasts are always role=status to avoid stuttering issues with role=alert in SRs.
            role="status"
            aria-live={type === 'foreground' ? 'assertive' : 'polite'}
            aria-atomic
          >
            {announceTextContent}
          </ToastAnnounce>
        )}

        <ToastInteractiveProvider
          scope={__scopeToast}
          onClose={() => {
            handleClose()
          }}
        >
          {ReactDOM.createPortal(
            <Collection.ItemSlot scope={__scopeToast}>
              <Dismissable
                // asChild
                onEscapeKeyDown={composeEventHandlers(onEscapeKeyDown, () => {
                  if (!context.isFocusedToastEscapeKeyDownRef.current) {
                    handleClose()
                  }
                  context.isFocusedToastEscapeKeyDownRef.current = false
                })}
              >
                <ToastImplFrame
                  // Ensure toasts are announced as status list or status when focused
                  role="status"
                  aria-live="off"
                  aria-atomic
                  tabIndex={0}
                  data-state={open ? 'open' : 'closed'}
                  data-swipe-direction={context.swipeDirection}
                  {...toastProps}
                  ref={composedRefs}
                  style={{ userSelect: 'none', touchAction: 'none', ...props.style }}
                  onKeyDown={composeEventHandlers(props.onKeyDown, (event) => {
                    if (event.key !== 'Escape') return
                    onEscapeKeyDown?.(event.nativeEvent)
                    if (!event.nativeEvent.defaultPrevented) {
                      context.isFocusedToastEscapeKeyDownRef.current = true
                      handleClose()
                    }
                  })}
                  onPointerDown={composeEventHandlers(props.onPointerDown, (event) => {
                    if (event.button !== 0) return
                    pointerStartRef.current = { x: event.clientX, y: event.clientY }
                  })}
                  onPointerMove={composeEventHandlers(props.onPointerMove, (event) => {
                    if (!pointerStartRef.current) return
                    const x = event.clientX - pointerStartRef.current.x
                    const y = event.clientY - pointerStartRef.current.y
                    const hasSwipeMoveStarted = Boolean(swipeDeltaRef.current)
                    const isHorizontalSwipe = ['left', 'right'].includes(
                      context.swipeDirection
                    )
                    const clamp = ['left', 'up'].includes(context.swipeDirection)
                      ? Math.min
                      : Math.max
                    const clampedX = isHorizontalSwipe ? clamp(0, x) : 0
                    const clampedY = !isHorizontalSwipe ? clamp(0, y) : 0
                    const moveStartBuffer = event.pointerType === 'touch' ? 10 : 2
                    const delta = { x: clampedX, y: clampedY }
                    const eventDetail = { originalEvent: event, delta }
                    if (hasSwipeMoveStarted) {
                      swipeDeltaRef.current = delta
                      handleAndDispatchCustomEvent(
                        TOAST_SWIPE_MOVE,
                        onSwipeMove,
                        eventDetail,
                        {
                          discrete: false,
                        }
                      )
                    } else if (
                      isDeltaInDirection(delta, context.swipeDirection, moveStartBuffer)
                    ) {
                      swipeDeltaRef.current = delta
                      handleAndDispatchCustomEvent(
                        TOAST_SWIPE_START,
                        onSwipeStart,
                        eventDetail,
                        {
                          discrete: false,
                        }
                      )
                      ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
                    } else if (
                      Math.abs(x) > moveStartBuffer ||
                      Math.abs(y) > moveStartBuffer
                    ) {
                      // User is swiping in wrong direction so we disable swipe gesture
                      // for the current pointer down interaction
                      pointerStartRef.current = null
                    }
                  })}
                  onPointerUp={composeEventHandlers(props.onPointerUp, (event) => {
                    const delta = swipeDeltaRef.current
                    const target = event.target as HTMLElement
                    if (target.hasPointerCapture(event.pointerId)) {
                      target.releasePointerCapture(event.pointerId)
                    }
                    swipeDeltaRef.current = null
                    pointerStartRef.current = null
                    if (delta) {
                      const toast = event.currentTarget
                      const eventDetail = { originalEvent: event, delta }
                      if (
                        isDeltaInDirection(
                          delta,
                          context.swipeDirection,
                          context.swipeThreshold
                        )
                      ) {
                        handleAndDispatchCustomEvent(
                          TOAST_SWIPE_END,
                          onSwipeEnd,
                          eventDetail,
                          {
                            discrete: true,
                          }
                        )
                      } else {
                        handleAndDispatchCustomEvent(
                          TOAST_SWIPE_CANCEL,
                          onSwipeCancel,
                          eventDetail,
                          {
                            discrete: true,
                          }
                        )
                      }
                      // Prevent click event from triggering on items within the toast when
                      // pointer up is part of a swipe gesture
                      toast.addEventListener('click', (event) => event.preventDefault(), {
                        once: true,
                      })
                    }
                  })}
                />
              </Dismissable>
            </Collection.ItemSlot>,
            context.viewport
          )}
        </ToastInteractiveProvider>
      </>
    )
  }
)

ToastImpl.propTypes = {
  type(props) {
    if (props.type && !['foreground', 'background'].includes(props.type)) {
      const error = `Invalid prop \`type\` supplied to \`${TOAST_NAME}\`. Expected \`foreground | background\`.`
      return new Error(error)
    }
    return null
  },
}

/* -----------------------------------------------------------------------------------------------*/

interface ToastAnnounceProps
  extends Omit<GetProps<typeof VisuallyHidden>, 'children'>,
    ScopedProps<{ children: string[] }> {}

const ToastAnnounce: React.FC<ToastAnnounceProps> = (
  props: ScopedProps<ToastAnnounceProps>
) => {
  const { __scopeToast, children, ...announceProps } = props
  const context = useToastProviderContext(TOAST_NAME, __scopeToast)
  const [renderAnnounceText, setRenderAnnounceText] = React.useState(false)
  const [isAnnounced, setIsAnnounced] = React.useState(false)

  // render text content in the next frame to ensure toast is announced in NVDA
  useNextFrame(() => setRenderAnnounceText(true))

  // cleanup after announcing
  React.useEffect(() => {
    const timer = window.setTimeout(() => setIsAnnounced(true), 1000)
    return () => window.clearTimeout(timer)
  }, [])

  return isAnnounced ? null : (
    <Portal asChild>
      <VisuallyHidden {...announceProps}>
        {renderAnnounceText && (
          <Text>
            {context.label} {children}
          </Text>
        )}
      </VisuallyHidden>
    </Portal>
  )
}

/* ---------------------------------------------------------------------------------------------- */

interface CreateToastOptions {
  native: boolean | ('web' | 'mobile')[]
}
interface ToastOptions extends BurntToastOptions {
  additionalInfo?: Record<string, any>
}

const createToast = (options: CreateToastOptions) => {
  const context = useToastProviderContext('useToast', undefined)
  const [toasts, setToasts] = React.useState<any[]>([])

  return {
    toastCount: context.toastCount,
    toasts: options.native ? [] : toasts,
    show: (
      showOptions: Pick<
        CreateNativeToastsOptions,
        'title' | 'body' | 'preset' | 'duration'
      >
    ) => {
      const id = toasts.length ? toasts[toasts.length - 1].id + 1 : 1
      // context.onToastAdd()
      setToasts([...toasts, { id, ...showOptions }])
      if (
        options.native === true ||
        (Array.isArray(options.native) &&
          ((isWeb && options.native.includes('web')) ||
            (!isWeb && options.native.includes('mobile'))))
      ) {
        createNativeToast(showOptions)
      }
    },
    hide: () => {
      // context.onToastRemove()
    },
  }
}

/* ---------------------------------------------------------------------------------------------- */

function handleAndDispatchCustomEvent<
  E extends CustomEvent,
  ReactEvent extends React.SyntheticEvent
>(
  name: string,
  handler: ((event: E) => void) | undefined,
  detail: { originalEvent: ReactEvent } & (E extends CustomEvent<infer D> ? D : never),
  { discrete }: { discrete: boolean }
) {
  const currentTarget = detail.originalEvent.currentTarget as HTMLElement
  const event = new CustomEvent(name, { bubbles: true, cancelable: true, detail })
  if (handler)
    currentTarget.addEventListener(name, handler as EventListener, { once: true })

  if (discrete) {
    dispatchDiscreteCustomEvent(currentTarget, event)
  } else {
    currentTarget.dispatchEvent(event)
  }
}

const isDeltaInDirection = (
  delta: { x: number; y: number },
  direction: SwipeDirection,
  threshold = 0
) => {
  const deltaX = Math.abs(delta.x)
  const deltaY = Math.abs(delta.y)
  const isDeltaX = deltaX > deltaY
  if (direction === 'left' || direction === 'right') {
    return isDeltaX && deltaX > threshold
  } else {
    return !isDeltaX && deltaY > threshold
  }
}

function useNextFrame(callback = () => {}) {
  const fn = useEvent(callback)
  useIsomorphicLayoutEffect(() => {
    let raf1 = 0
    let raf2 = 0
    raf1 = window.requestAnimationFrame(() => (raf2 = window.requestAnimationFrame(fn)))
    return () => {
      window.cancelAnimationFrame(raf1)
      window.cancelAnimationFrame(raf2)
    }
  }, [fn])
}

function isHTMLElement(node: any): node is HTMLElement {
  return node.nodeType === node.ELEMENT_NODE
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

function focusFirst(candidates: HTMLElement[]) {
  const previouslyFocusedElement = document.activeElement
  return candidates.some((candidate) => {
    // if focus is already where we want to go, we don't want to keep going through the candidates
    if (candidate === previouslyFocusedElement) return true
    candidate.focus()
    return document.activeElement !== previouslyFocusedElement
  })
}

export {
  createToastScope,
  //
  ToastProvider,
  Toast,
  createToast,
}
export type {
  ToastProviderProps,
  ToastViewportProps,
  ToastProps,
  ToastTitleProps,
  ToastDescriptionProps,
  ToastActionProps,
  ToastCloseProps,
}
