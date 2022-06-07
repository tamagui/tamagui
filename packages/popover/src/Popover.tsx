// adapted from radix-ui popover

import '@tamagui/polyfill-dev'

import {
  useDelayGroup,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react-dom-interactions'
import { AnimatePresence } from '@tamagui/animate-presence'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  Theme,
  composeEventHandlers,
  useId,
  useThemeName,
  withStaticProperties,
} from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
// import { DismissableLayer } from '@tamagui/react-dismissable-layer'
// import { useFocusGuards } from '@tamagui/react-focus-guards'
// import { FocusScope } from '@tamagui/react-focus-scope'
import {
  FloatingOverrideContext,
  Popper,
  PopperAnchor,
  PopperArrow,
  PopperContent,
  PopperContentProps,
  PopperProps,
  UseFloatingFn,
  createPopperScope,
} from '@tamagui/popper'
import { Portal } from '@tamagui/portal'
import { YStack, YStackProps } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
// import { hideOthers } from 'aria-hidden'
import * as React from 'react'
import { GestureResponderEvent, View } from 'react-native'

// import { RemoveScroll } from 'react-remove-scroll'

const POPOVER_NAME = 'Popover'

type ScopedProps<P> = P & { __scopePopover?: Scope }
const [createPopoverContext, createPopoverScopeInternal] = createContextScope(POPOVER_NAME, [
  createPopperScope,
])
export const usePopoverScope = createPopperScope()
export const createPopoverScope = createPopoverScopeInternal

type PopoverContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>
  contentId?: string
  open: boolean
  onOpenChange(open: boolean): void
  onOpenToggle(): void
  hasCustomAnchor: boolean
  onCustomAnchorAdd(): void
  onCustomAnchorRemove(): void
  modal: boolean
}

const [PopoverProviderInternal, usePopoverInternalContext] =
  createPopoverContext<PopoverContextValue>(POPOVER_NAME)

export const __PopoverProviderInternal = PopoverProviderInternal

/* -------------------------------------------------------------------------------------------------
 * PopoverAnchor
 * -----------------------------------------------------------------------------------------------*/

const ANCHOR_NAME = 'PopoverAnchor'

type PopoverAnchorElement = HTMLElement | View
export type PopoverAnchorProps = YStackProps

export const PopoverAnchor = React.forwardRef<PopoverAnchorElement, PopoverAnchorProps>(
  (props: ScopedProps<PopoverAnchorProps>, forwardedRef) => {
    const { __scopePopover, ...anchorProps } = props
    const context = usePopoverInternalContext(ANCHOR_NAME, __scopePopover)
    const popperScope = usePopoverScope(__scopePopover)
    const { onCustomAnchorAdd, onCustomAnchorRemove } = context

    React.useEffect(() => {
      onCustomAnchorAdd()
      return () => onCustomAnchorRemove()
    }, [onCustomAnchorAdd, onCustomAnchorRemove])

    return <PopperAnchor {...popperScope} {...anchorProps} ref={forwardedRef} />
  }
)

PopoverAnchor.displayName = ANCHOR_NAME

/* -------------------------------------------------------------------------------------------------
 * PopoverTrigger
 * -----------------------------------------------------------------------------------------------*/

const TRIGGER_NAME = 'PopoverTrigger'

type PopoverTriggerElement = HTMLElement | View
export type PopoverTriggerProps = YStackProps

export const PopoverTrigger = React.forwardRef<PopoverTriggerElement, PopoverTriggerProps>(
  (props: ScopedProps<PopoverTriggerProps>, forwardedRef) => {
    const { __scopePopover, ...triggerProps } = props
    const context = usePopoverInternalContext(TRIGGER_NAME, __scopePopover)
    const popperScope = usePopoverScope(__scopePopover)
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef)

    const trigger = (
      <YStack
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.contentId}
        data-state={getState(context.open)}
        {...triggerProps}
        ref={composedTriggerRef}
        onPress={composeEventHandlers(props.onPress, context.onOpenToggle)}
      />
    )

    return context.hasCustomAnchor ? (
      trigger
    ) : (
      <PopperAnchor asChild {...popperScope}>
        {trigger}
      </PopperAnchor>
    )
  }
)

PopoverTrigger.displayName = TRIGGER_NAME

/* -------------------------------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'PopoverContent'

export interface PopoverContentTypeProps
  extends Omit<PopoverContentImplProps, 'trapFocus' | 'disableOutsidePointerEvents'> {
  /**
   * @see https://github.com/theKashey/react-remove-scroll#usage
   */
  allowPinchZoom?: RemoveScrollProps['allowPinchZoom']
}

export type PopoverContentProps = PopoverContentTypeProps

export const PopoverContent = React.forwardRef<PopoverContentTypeElement, PopoverContentProps>(
  (props: ScopedProps<PopoverContentProps>, forwardedRef) => {
    const context = usePopoverInternalContext(CONTENT_NAME, props.__scopePopover)
    return context.modal ? (
      <PopoverContentModal {...props} ref={forwardedRef} />
    ) : (
      <PopoverContentNonModal {...props} ref={forwardedRef} />
    )
  }
)

PopoverContent.displayName = CONTENT_NAME

/* -----------------------------------------------------------------------------------------------*/

type RemoveScrollProps = any //React.ComponentProps<typeof RemoveScroll>
type PopoverContentTypeElement = PopoverContentImplElement

const PopoverContentModal = React.forwardRef<PopoverContentTypeElement, PopoverContentTypeProps>(
  (props: ScopedProps<PopoverContentTypeProps>, forwardedRef) => {
    const { allowPinchZoom, ...contentModalProps } = props
    const context = usePopoverInternalContext(CONTENT_NAME, props.__scopePopover)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, contentRef)
    const isRightClickOutsideRef = React.useRef(false)
    const themeName = useThemeName()

    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    // React.useEffect(() => {
    //   const content = contentRef.current
    //   if (content) return hideOthers(content)
    // }, [])

    const PortalWrapper = context.modal ? Portal : React.Fragment

    return (
      <PortalWrapper>
        <Theme name={themeName}>
          {/* <RemoveScroll allowPinchZoom={allowPinchZoom}> */}
          <PopoverContentImpl
            {...contentModalProps}
            ref={composedRefs}
            // we make sure we're not trapping once it's been closed
            // (closed !== unmounted when animating out)
            trapFocus={context.open}
            disableOutsidePointerEvents
            onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
              event.preventDefault()
              if (!isRightClickOutsideRef.current) context.triggerRef.current?.focus()
            })}
            onPointerDownOutside={composeEventHandlers(
              props.onPointerDownOutside,
              (event) => {
                // @ts-expect-error
                const originalEvent = event.detail.originalEvent
                const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true
                const isRightClick = originalEvent.button === 2 || ctrlLeftClick
                isRightClickOutsideRef.current = isRightClick
              },
              { checkDefaultPrevented: false }
            )}
            // When focus is trapped, a `focusout` event may still happen.
            // We make sure we don't trigger our `onDismiss` in such case.
            onFocusOutside={composeEventHandlers(
              props.onFocusOutside,
              (event) => event.preventDefault(),
              { checkDefaultPrevented: false }
            )}
          />
        </Theme>
        {/* </RemoveScroll> */}
      </PortalWrapper>
    )
  }
)

const PopoverContentNonModal = React.forwardRef<PopoverContentTypeElement, PopoverContentTypeProps>(
  (props: ScopedProps<PopoverContentTypeProps>, forwardedRef) => {
    const { ...contentNonModalProps } = props
    const context = usePopoverInternalContext(CONTENT_NAME, props.__scopePopover)
    const hasInteractedOutsideRef = React.useRef(false)
    const PortalWrapper = context.modal ? Portal : React.Fragment

    return (
      <PortalWrapper>
        <PopoverContentImpl
          {...contentNonModalProps}
          ref={forwardedRef}
          trapFocus={false}
          disableOutsidePointerEvents={false}
          onCloseAutoFocus={(event) => {
            props.onCloseAutoFocus?.(event)

            if (!event.defaultPrevented) {
              if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus()
              // Always prevent auto focus because we either focus manually or want user agent focus
              event.preventDefault()
            }

            hasInteractedOutsideRef.current = false
          }}
          onInteractOutside={(event) => {
            props.onInteractOutside?.(event)

            if (!event.defaultPrevented) hasInteractedOutsideRef.current = true

            // Prevent dismissing when clicking the trigger.
            // As the trigger is already setup to close, without doing so would
            // cause it to close and immediately open.
            //
            // We use `onInteractOutside` as some browsers also
            // focus on pointer down, creating the same issue.
            // @ts-ignore
            const target = event.target as HTMLElement
            const targetIsTrigger = context.triggerRef.current?.contains(target)
            if (targetIsTrigger) event.preventDefault()
          }}
        />
      </PortalWrapper>
    )
  }
)

/* -----------------------------------------------------------------------------------------------*/

type PopoverContentImplElement = React.ElementRef<typeof PopperContent>

// TODO
type FocusScopeProps = {
  /**
   * Whether focus should be trapped within the FocusScope
   * (default: false)
   */
  trapped?: boolean

  /**
   * Event handler called when auto-focusing on mount.
   * Can be prevented.
   */
  onMountAutoFocus?: (event: GestureResponderEvent) => void

  /**
   * Event handler called when auto-focusing on unmount.
   * Can be prevented.
   */
  onUnmountAutoFocus?: (event: GestureResponderEvent) => void
}

type DismissableLayerProps = {
  /**
   * When `true`, hover/focus/click interactions will be disabled on elements outside the `DismissableLayer`.
   * Users will need to click twice on outside elements to interact with them:
   * Once to close the `DismissableLayer`, and again to trigger the element.
   */
  disableOutsidePointerEvents?: boolean

  /**
   * Event handler called when the escape key is down.
   * Can be prevented.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void

  /**
   * Event handler called when the a pointer event happens outside of the `DismissableLayer`.
   * Can be prevented.
   */
  onPointerDownOutside?: (event: GestureResponderEvent) => void
  // onPointerDownOutside?: (event: MouseEvent | TouchEvent) => void

  /**
   * Event handler called when the focus moves outside of the `DismissableLayer`.
   * Can be prevented.
   */
  onFocusOutside?: (event: React.FocusEvent) => void

  /**
   * Event handler called when an interaction happens outside the `DismissableLayer`.
   * Specifically, when a pointer event happens outside of the `DismissableLayer` or focus moves outside of it.
   * Can be prevented.
   */
  onInteractOutside?: (event: GestureResponderEvent) => void
  // onInteractOutside?: (event: MouseEvent | TouchEvent | React.FocusEvent) => void

  /** Callback called when the `DismissableLayer` should be dismissed */
  onDismiss?: () => void
}

export interface PopoverContentImplProps
  extends PopperContentProps,
    Omit<DismissableLayerProps, 'onDismiss'> {
  /**
   * Whether focus should be trapped within the `Popover`
   * (default: false)
   */
  trapFocus?: FocusScopeProps['trapped']

  /**
   * Event handler called when auto-focusing on open.
   * Can be prevented.
   */
  onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus']

  /**
   * Event handler called when auto-focusing on close.
   * Can be prevented.
   */
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus']
}

const PopoverContentImpl = React.forwardRef<PopoverContentImplElement, PopoverContentImplProps>(
  (props: ScopedProps<PopoverContentImplProps>, forwardedRef) => {
    const {
      __scopePopover,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      ...contentProps
    } = props
    const context = usePopoverInternalContext(CONTENT_NAME, __scopePopover)
    const popperScope = usePopoverScope(__scopePopover)

    // Make sure the whole tree has focus guards as our `Popover` may be
    // the last element in the DOM (beacuse of the `Portal`)
    // useFocusGuards()

    // <FocusScope
    //   asChild
    //   loop
    //   trapped={trapFocus}
    //   onMountAutoFocus={onOpenAutoFocus}
    //   onUnmountAutoFocus={onCloseAutoFocus}
    // >
    // <DismissableLayer
    //   asChild
    //   disableOutsidePointerEvents={disableOutsidePointerEvents}
    //   onInteractOutside={onInteractOutside}
    //   onEscapeKeyDown={onEscapeKeyDown}
    //   onPointerDownOutside={onPointerDownOutside}
    //   onFocusOutside={onFocusOutside}
    //   onDismiss={() => context.onOpenChange(false)}
    // >
    return (
      <AnimatePresence>
        {!!context.open && (
          <PopperContent
            data-state={getState(context.open)}
            // role="dialog"
            id={context.contentId}
            pointerEvents="auto"
            {...popperScope}
            {...contentProps}
            ref={forwardedRef}
          />
        )}
      </AnimatePresence>
    )
    // </DismissableLayer>
    // </FocusScope>
  }
)

/* -------------------------------------------------------------------------------------------------
 * PopoverClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'PopoverClose'

type PopoverCloseElement = HTMLElement | View
export type PopoverCloseProps = YStackProps

export const PopoverClose = React.forwardRef<PopoverCloseElement, PopoverCloseProps>(
  (props: ScopedProps<PopoverCloseProps>, forwardedRef) => {
    const { __scopePopover, ...closeProps } = props
    const context = usePopoverInternalContext(CLOSE_NAME, __scopePopover)
    return (
      <YStack
        {...closeProps}
        ref={forwardedRef}
        onPress={composeEventHandlers(props.onPress, () => context.onOpenChange(false))}
      />
    )
  }
)

PopoverClose.displayName = CLOSE_NAME

/* -------------------------------------------------------------------------------------------------
 * PopoverArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'PopoverArrow'

type PopoverArrowElement = HTMLElement | View
export type PopoverArrowProps = YStackProps

export const PopoverArrow = React.forwardRef<PopoverArrowElement, PopoverArrowProps>(
  (props: ScopedProps<PopoverArrowProps>, forwardedRef) => {
    const { __scopePopover, ...arrowProps } = props
    const popperScope = usePopoverScope(__scopePopover)
    return <PopperArrow {...popperScope} {...arrowProps} ref={forwardedRef} />
  }
)

PopoverArrow.displayName = ARROW_NAME

/* -------------------------------------------------------------------------------------------------
 * Popover
 * -----------------------------------------------------------------------------------------------*/

export type PopoverProps = PopperProps & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
}

export const Popover = withStaticProperties(
  ((props: ScopedProps<PopoverProps>) => {
    const {
      __scopePopover,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      modal = true,
      ...restProps
    } = props
    const popperScope = usePopoverScope(__scopePopover)
    const triggerRef = React.useRef<HTMLButtonElement>(null)
    const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false)
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen || false,
      onChange: onOpenChange,
    })

    const useFloatingFn: UseFloatingFn = (props) => {
      const floating = useFloating({
        ...props,
        open,
        onOpenChange: setOpen,
      })
      const { getReferenceProps, getFloatingProps } = useInteractions([
        useFocus(floating.context),
        useRole(floating.context, { role: 'dialog' }),
        useDismiss(floating.context),
      ])
      return {
        ...floating,
        getReferenceProps,
        getFloatingProps,
      } as any
    }

    const useFloatingContext = React.useCallback(useFloatingFn, [open])

    return (
      <FloatingOverrideContext.Provider value={useFloatingContext}>
        <Popper {...popperScope} {...restProps}>
          <PopoverProviderInternal
            scope={__scopePopover}
            contentId={useId()}
            triggerRef={triggerRef}
            open={open}
            onOpenChange={setOpen}
            onOpenToggle={React.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen])}
            hasCustomAnchor={hasCustomAnchor}
            onCustomAnchorAdd={React.useCallback(() => setHasCustomAnchor(true), [])}
            onCustomAnchorRemove={React.useCallback(() => setHasCustomAnchor(false), [])}
            modal={modal}
          >
            {children}
          </PopoverProviderInternal>
        </Popper>
      </FloatingOverrideContext.Provider>
    )
  }) as React.FC<PopoverProps>,
  {
    Anchor: PopoverAnchor,
    Arrow: PopoverArrow,
    Trigger: PopoverTrigger,
    Content: PopoverContent,
    Close: PopoverClose,
  }
)

Popover.displayName = POPOVER_NAME

/* -----------------------------------------------------------------------------------------------*/

function getState(open: boolean) {
  return open ? 'open' : 'closed'
}
