// adapted from radix-ui popover

import '@tamagui/polyfill-dev'

import {
  FloatingFocusManager,
  Props,
  useDismiss,
  useFloating,
  useFocus,
  useInteractions,
  useRole,
} from '@floating-ui/react-dom-interactions'
import { AnimatePresence } from '@tamagui/animate-presence'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  SizeTokens,
  Theme,
  composeEventHandlers,
  useId,
  useThemeName,
  withStaticProperties,
} from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { Dismissable, DismissableProps } from '@tamagui/dismissable'
import { FocusScope, FocusScopeProps } from '@tamagui/focus-scope'
import {
  FloatingOverrideContext,
  Popper,
  PopperAnchor,
  PopperArrow,
  PopperArrowProps,
  PopperContent,
  PopperContentProps,
  PopperProps,
  createPopperScope,
  usePopperContext,
} from '@tamagui/popper'
import { Portal } from '@tamagui/portal'
import { YStack, YStackProps } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import { hideOthers } from 'aria-hidden'
import * as React from 'react'
import { View } from 'react-native'
import { RemoveScroll } from 'react-remove-scroll'

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
  size?: SizeTokens
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

type RemoveScrollProps = React.ComponentProps<typeof RemoveScroll>
type PopoverContentTypeElement = PopoverContentImplElement

export const PopoverContent = React.forwardRef<PopoverContentTypeElement, PopoverContentTypeProps>(
  (props: ScopedProps<PopoverContentTypeProps>, forwardedRef) => {
    const { allowPinchZoom, ...contentModalProps } = props
    const context = usePopoverInternalContext(CONTENT_NAME, props.__scopePopover)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, contentRef)
    const isRightClickOutsideRef = React.useRef(false)
    const themeName = useThemeName()

    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    React.useEffect(() => {
      if (!context.open) return
      const content = contentRef.current
      if (content) return hideOthers(content)
    }, [context.open])

    return (
      <Portal>
        <Theme name={themeName}>
          <RemoveScroll allowPinchZoom={allowPinchZoom}>
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
          </RemoveScroll>
        </Theme>
      </Portal>
    )
  }
)

/* -----------------------------------------------------------------------------------------------*/

type PopoverContentImplElement = React.ElementRef<typeof PopperContent>

export interface PopoverContentImplProps
  extends PopperContentProps,
    Omit<DismissableProps, 'onDismiss' | 'children'> {
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
      children,
      ...contentProps
    } = props
    const popperScope = usePopoverScope(__scopePopover)
    const context = usePopoverInternalContext(CONTENT_NAME, popperScope.__scopePopover)
    // const popperContext = usePopperContext(CONTENT_NAME, popperScope.__scopePopper)

    // const handleDismiss = React.useCallback(() => context.onOpenChange(false), [])
    // <Dismissable
    //     disableOutsidePointerEvents={disableOutsidePointerEvents}
    //     // onInteractOutside={onInteractOutside}
    //     onEscapeKeyDown={onEscapeKeyDown}
    //     // onPointerDownOutside={onPointerDownOutside}
    //     // onFocusOutside={onFocusOutside}
    //     onDismiss={handleDismiss}
    //   >

    return (
      <AnimatePresence>
        {!!context.open && (
          <PopperContent
            key="popper-content"
            data-state={getState(context.open)}
            id={context.contentId}
            pointerEvents="auto"
            {...popperScope}
            {...contentProps}
            ref={forwardedRef}
          >
            <FocusScope
              loop
              trapped={trapFocus ?? context.open}
              onMountAutoFocus={onOpenAutoFocus}
              onUnmountAutoFocus={onCloseAutoFocus}
            >
              <div style={{ display: 'contents' }}>{children}</div>
            </FocusScope>
          </PopperContent>
        )}
      </AnimatePresence>
    )
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
export type PopoverArrowProps = PopperArrowProps

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
}

export const Popover = withStaticProperties(
  ((props: ScopedProps<PopoverProps>) => {
    const {
      __scopePopover,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
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

    const useFloatingContext = React.useCallback(
      (props: Props) => {
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
        }
      },
      [open]
    )

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
