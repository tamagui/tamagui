// adapted from radix-ui popover

// see floating portal
// import { Portal } from '@tamagui/react-portal'
import { AnimatePresence } from '@tamagui/animate-presence'
import { useComposedRefs } from '@tamagui/compose-refs'
import { composeEventHandlers, useId } from '@tamagui/core'
import { createContextScope } from '@tamagui/create-context'
import type { Scope } from '@tamagui/create-context'
// import { DismissableLayer } from '@tamagui/react-dismissable-layer'
// import { useFocusGuards } from '@tamagui/react-focus-guards'
// import { FocusScope } from '@tamagui/react-focus-scope'
// import * as PopperPrimitive from '@tamagui/react-popper'
import {
  Popper,
  PopperAnchor,
  PopperArrow,
  PopperContent,
  PopperContentProps,
  createPopperScope,
} from '@tamagui/popper'
import { YStack } from '@tamagui/stacks'
// import { Primitive } from '@tamagui/react-primitive'
// import type * as Radix from '@tamagui/react-primitive'
import { useControllableState } from '@tamagui/use-controllable-state'
// import { hideOthers } from 'aria-hidden'
import * as React from 'react'
// import { RemoveScroll } from 'react-remove-scroll'

/* -------------------------------------------------------------------------------------------------
 * Popover
 * -----------------------------------------------------------------------------------------------*/

const POPOVER_NAME = 'Popover'

type ScopedProps<P> = P & { __scopePopover?: Scope }
const [createPopoverContext, createPopoverScope] = createContextScope(POPOVER_NAME, [
  createPopperScope,
])
const usePopperScope = createPopperScope()

type PopoverContextValue = {
  triggerRef: React.RefObject<HTMLButtonElement>
  contentId: string
  open: boolean
  onOpenChange(open: boolean): void
  onOpenToggle(): void
  hasCustomAnchor: boolean
  onCustomAnchorAdd(): void
  onCustomAnchorRemove(): void
  modal: boolean
}

const [PopoverProvider, usePopoverContext] = createPopoverContext<PopoverContextValue>(POPOVER_NAME)

interface PopoverProps {
  children?: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean
}

const Popover: React.FC<PopoverProps> = (props: ScopedProps<PopoverProps>) => {
  const {
    __scopePopover,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = false,
  } = props
  const popperScope = usePopperScope(__scopePopover)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false)
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen || false,
    onChange: onOpenChange,
  })

  return (
    <Popper {...popperScope}>
      <PopoverProvider
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
      </PopoverProvider>
    </Popper>
  )
}

Popover.displayName = POPOVER_NAME

/* -------------------------------------------------------------------------------------------------
 * PopoverAnchor
 * -----------------------------------------------------------------------------------------------*/

const ANCHOR_NAME = 'PopoverAnchor'

type PopoverAnchorElement = any //React.ElementRef<typeof PopperPrimitive.Anchor>
type PopperAnchorProps = any //Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Anchor>
interface PopoverAnchorProps extends PopperAnchorProps {}

const PopoverAnchor = React.forwardRef<PopoverAnchorElement, PopoverAnchorProps>(
  (props: ScopedProps<PopoverAnchorProps>, forwardedRef) => {
    const { __scopePopover, ...anchorProps } = props
    const context = usePopoverContext(ANCHOR_NAME, __scopePopover)
    const popperScope = usePopperScope(__scopePopover)
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

type PopoverTriggerElement = any //React.ElementRef<typeof Primitive.button>
type PrimitiveButtonProps = any //Radix.ComponentPropsWithoutRef<typeof Primitive.button>
interface PopoverTriggerProps extends PrimitiveButtonProps {}

const PopoverTrigger = React.forwardRef<PopoverTriggerElement, PopoverTriggerProps>(
  (props: ScopedProps<PopoverTriggerProps>, forwardedRef) => {
    const { __scopePopover, ...triggerProps } = props
    const context = usePopoverContext(TRIGGER_NAME, __scopePopover)
    const popperScope = usePopperScope(__scopePopover)
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef)

    const trigger = (
      <YStack
        type="button"
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.contentId}
        data-state={getState(context.open)}
        {...triggerProps}
        ref={composedTriggerRef}
        // @ts-expect-error
        onPress={composeEventHandlers(props.onPress, context.onOpenToggle)}
      />
    )

    return context.hasCustomAnchor ? (
      trigger
    ) : (
      // todo
      // @ts-ignore
      <PopperAnchor
        // asChild
        {...popperScope}
      >
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

interface PopoverContentProps extends PopoverContentTypeProps {
  /**
   * Used to force mounting when more control is needed. Useful when
   * controlling animation with React animation libraries.
   */
  forceMount?: true
}

const PopoverContent = React.forwardRef<PopoverContentTypeElement, PopoverContentProps>(
  (props: ScopedProps<PopoverContentProps>, forwardedRef) => {
    const { forceMount, ...contentProps } = props
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover)
    const isOpen = forceMount || context.open
    const contents = !isOpen ? null : context.modal ? (
      <PopoverContentModal {...contentProps} ref={forwardedRef} />
    ) : (
      <PopoverContentNonModal {...contentProps} ref={forwardedRef} />
    )

    return <AnimatePresence>{contents}</AnimatePresence>
  }
)

PopoverContent.displayName = CONTENT_NAME

/* -----------------------------------------------------------------------------------------------*/

type RemoveScrollProps = any //React.ComponentProps<typeof RemoveScroll>
type PopoverContentTypeElement = PopoverContentImplElement
interface PopoverContentTypeProps
  extends Omit<PopoverContentImplProps, 'trapFocus' | 'disableOutsidePointerEvents'> {
  /**
   * @see https://github.com/theKashey/react-remove-scroll#usage
   */
  allowPinchZoom?: RemoveScrollProps['allowPinchZoom']
  /**
   * Whether the `Popover` should render in a `Portal`
   * (default: `true`)
   */
  portalled?: boolean
}

const PopoverContentModal = React.forwardRef<PopoverContentTypeElement, PopoverContentTypeProps>(
  (props: ScopedProps<PopoverContentTypeProps>, forwardedRef) => {
    const { allowPinchZoom, portalled = true, ...contentModalProps } = props
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover)
    const contentRef = React.useRef<HTMLDivElement>(null)
    const composedRefs = useComposedRefs(forwardedRef, contentRef)
    const isRightClickOutsideRef = React.useRef(false)

    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    // React.useEffect(() => {
    //   const content = contentRef.current
    //   if (content) return hideOthers(content)
    // }, [])

    const PortalWrapper = React.Fragment //portalled ? Portal : React.Fragment

    return (
      <PortalWrapper>
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
        {/* </RemoveScroll> */}
      </PortalWrapper>
    )
  }
)

const PopoverContentNonModal = React.forwardRef<PopoverContentTypeElement, PopoverContentTypeProps>(
  (props: ScopedProps<PopoverContentTypeProps>, forwardedRef) => {
    const { portalled = true, ...contentNonModalProps } = props
    const context = usePopoverContext(CONTENT_NAME, props.__scopePopover)
    const hasInteractedOutsideRef = React.useRef(false)
    const PortalWrapper = React.Fragment //portalled ? Portal : React.Fragment

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
type FocusScopeProps = any //Radix.ComponentPropsWithoutRef<typeof FocusScope>
type DismissableLayerProps = any //Radix.ComponentPropsWithoutRef<typeof DismissableLayer>
interface PopoverContentImplProps
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
    const context = usePopoverContext(CONTENT_NAME, __scopePopover)
    const popperScope = usePopperScope(__scopePopover)

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
      <PopperContent
        data-state={getState(context.open)}
        // role="dialog"
        id={context.contentId}
        {...popperScope}
        {...contentProps}
        ref={forwardedRef}
      />
    )
    // </DismissableLayer>
    // </FocusScope>
  }
)

/* -------------------------------------------------------------------------------------------------
 * PopoverClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'PopoverClose'

type PopoverCloseElement = any // React.ElementRef<typeof Primitive.button>
interface PopoverCloseProps extends PrimitiveButtonProps {}

const PopoverClose = React.forwardRef<PopoverCloseElement, PopoverCloseProps>(
  (props: ScopedProps<PopoverCloseProps>, forwardedRef) => {
    const { __scopePopover, ...closeProps } = props
    const context = usePopoverContext(CLOSE_NAME, __scopePopover)
    return (
      <YStack
        type="button"
        {...closeProps}
        ref={forwardedRef}
        // @ts-expect-error
        onPress={composeEventHandlers(props.onClick, () => context.onOpenChange(false))}
      />
    )
  }
)

PopoverClose.displayName = CLOSE_NAME

/* -------------------------------------------------------------------------------------------------
 * PopoverArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'PopoverArrow'

type PopoverArrowElement = any //React.ElementRef<typeof PopperPrimitive.Arrow>
type PopperArrowProps = any //Radix.ComponentPropsWithoutRef<typeof PopperPrimitive.Arrow>
interface PopoverArrowProps extends PopperArrowProps {}

const PopoverArrow = React.forwardRef<PopoverArrowElement, PopoverArrowProps>(
  (props: ScopedProps<PopoverArrowProps>, forwardedRef) => {
    const { __scopePopover, ...arrowProps } = props
    const popperScope = usePopperScope(__scopePopover)
    return <PopperArrow {...popperScope} {...arrowProps} ref={forwardedRef} />
  }
)

PopoverArrow.displayName = ARROW_NAME

/* -----------------------------------------------------------------------------------------------*/

function getState(open: boolean) {
  return open ? 'open' : 'closed'
}

// const Root = Popover
// const Anchor = PopoverAnchor
// const Trigger = PopoverTrigger
// const Content = PopoverContent
// const Close = PopoverClose
// const Arrow = PopoverArrow

export {
  createPopoverScope,
  //
  Popover,
  PopoverAnchor,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
  PopoverArrow,
  //
  // Root,
  // Anchor,
  // Trigger,
  // Content,
  // Close,
  // Arrow,
}
export type {
  PopoverProps,
  PopoverAnchorProps,
  PopoverTriggerProps,
  PopoverContentProps,
  PopoverCloseProps,
  PopoverArrowProps,
}
