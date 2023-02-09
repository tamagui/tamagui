// adapted from radix-ui popover

import '@tamagui/polyfill-dev'

import { AnimatePresence } from '@tamagui/animate-presence'
import { hideOthers } from '@tamagui/aria-hidden'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  MediaQueryKey,
  SizeTokens,
  Stack,
  Theme,
  composeEventHandlers,
  isWeb,
  useGet,
  useMedia,
  useThemeName,
} from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { DismissableProps } from '@tamagui/dismissable'
import { FocusScope, FocusScopeProps } from '@tamagui/focus-scope'
import {
  PopperAnchor,
  PopperArrow,
  PopperArrowProps,
  PopperContent,
  PopperContentProps,
  PopperProps,
  PopperProvider,
  createPopperScope,
  usePopperContext,
} from '@tamagui/popper'
import { Portal, PortalHost, PortalItem } from '@tamagui/portal'
import { RemoveScroll, RemoveScrollProps } from '@tamagui/remove-scroll'
import { SheetController } from '@tamagui/sheet'
import { YStack, YStackProps } from '@tamagui/stacks'
import * as React from 'react'
import { Platform, ScrollView, ScrollViewProps, View } from 'react-native'

export const POPOVER_NAME = 'Popover'

export type ScopedPopoverProps<P> = P & { __scopePopover?: Scope }

export type PopoverProps = PopperProps & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

type PopoverContextValue = {
  triggerRef: React.RefObject<any>
  contentId?: string
  open: boolean
  onOpenChange(open: boolean): void
  onOpenToggle(): void
  hasCustomAnchor: boolean
  onCustomAnchorAdd(): void
  onCustomAnchorRemove(): void
  size?: SizeTokens
  sheetBreakpoint: any
  scopeKey: string
  popperScope: any
  breakpointActive?: boolean
}

const [createPopoverContext, createPopoverScopeInternal] = createContextScope(
  POPOVER_NAME,
  [createPopperScope]
)
export const usePopoverScope = createPopperScope()
export const createPopoverScope = createPopoverScopeInternal

export const [PopoverProviderInternal, usePopoverInternalContext] =
  createPopoverContext<PopoverContextValue>(POPOVER_NAME)

export const __PopoverProviderInternal = PopoverProviderInternal

/* -------------------------------------------------------------------------------------------------
 * PopoverAnchor
 * -----------------------------------------------------------------------------------------------*/

const ANCHOR_NAME = 'PopoverAnchor'

type PopoverAnchorElement = HTMLElement | View
export type PopoverAnchorProps = YStackProps

export const PopoverAnchor = React.forwardRef<PopoverAnchorElement, PopoverAnchorProps>(
  (props: ScopedPopoverProps<PopoverAnchorProps>, forwardedRef) => {
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

export const PopoverTrigger = React.forwardRef<
  PopoverTriggerElement,
  PopoverTriggerProps
>((props: ScopedPopoverProps<PopoverTriggerProps>, forwardedRef) => {
  const { __scopePopover, ...triggerProps } = props
  const context = usePopoverInternalContext(TRIGGER_NAME, __scopePopover)
  const popperScope = usePopoverScope(__scopePopover)
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef)

  const trigger = (
    <YStack
      aria-haspopup="dialog"
      aria-expanded={context.open}
      // TODO not matching
      // aria-controls={context.contentId}
      data-state={getState(context.open)}
      {...triggerProps}
      ref={composedTriggerRef}
      onPress={composeEventHandlers(props.onPress as any, context.onOpenToggle)}
    />
  )

  return context.hasCustomAnchor ? (
    trigger
  ) : (
    <PopperAnchor asChild {...popperScope}>
      {trigger}
    </PopperAnchor>
  )
})

PopoverTrigger.displayName = TRIGGER_NAME

/* -------------------------------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'PopoverContent'

export type PopoverContentProps = PopoverContentTypeProps

type PopoverContentTypeElement = PopoverContentImplElement

export interface PopoverContentTypeProps
  extends Omit<PopoverContentImplProps, 'disableOutsidePointerEvents'> {
  /**
   * @see https://github.com/theKashey/react-remove-scroll#usage
   */
  allowPinchZoom?: RemoveScrollProps['allowPinchZoom']
}

export const PopoverContent = React.forwardRef<
  PopoverContentTypeElement,
  PopoverContentTypeProps
>((props: ScopedPopoverProps<PopoverContentTypeProps>, forwardedRef) => {
  const {
    allowPinchZoom,
    trapFocus,
    disableRemoveScroll = true,
    zIndex,
    ...contentModalProps
  } = props
  const context = usePopoverInternalContext(CONTENT_NAME, props.__scopePopover)
  const contentRef = React.useRef<any>(null)
  const composedRefs = useComposedRefs(forwardedRef, contentRef)
  const isRightClickOutsideRef = React.useRef(false)

  // aria-hide everything except the content (better supported equivalent to setting aria-modal)
  React.useEffect(() => {
    if (!context.open) return
    const content = contentRef.current
    if (content) return hideOthers(content)
  }, [context.open])

  return (
    <PopoverContentPortal zIndex={zIndex}>
      <PopoverContentImpl
        {...contentModalProps}
        disableRemoveScroll={disableRemoveScroll}
        ref={composedRefs}
        // we make sure we're not trapping once it's been closed
        // (closed !== unmounted when animating out)
        trapFocus={trapFocus ?? context.open}
        disableOutsidePointerEvents
        onCloseAutoFocus={composeEventHandlers(props.onCloseAutoFocus, (event) => {
          event.preventDefault()
          if (!isRightClickOutsideRef.current) context.triggerRef.current?.focus()
        })}
        onPointerDownOutside={composeEventHandlers(
          props.onPointerDownOutside,
          (event) => {
            const originalEvent = event.detail.originalEvent
            const ctrlLeftClick =
              originalEvent.button === 0 && originalEvent.ctrlKey === true
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
    </PopoverContentPortal>
  )
})

function PopoverContentPortal(props: ScopedPopoverProps<PopoverContentTypeProps>) {
  const themeName = useThemeName()
  const context = usePopoverInternalContext(CONTENT_NAME, props.__scopePopover)

  // on android we have to re-pass context
  let contents = props.children

  if (Platform.OS === 'android') {
    // ok conditional hooks by platform
    const popperContext = usePopperContext(CONTENT_NAME, context.popperScope)

    contents = (
      <PopperProvider {...popperContext} scope={context.popperScope}>
        <PopoverProviderInternal scope={props.__scopePopover} {...context}>
          {/* does this need to be props.__scopePopper? */}
          {props.children}
        </PopoverProviderInternal>
      </PopperProvider>
    )
  }

  const zIndex = props.zIndex ?? 1000

  // Portal the contents and add a transparent bg overlay to handle dismiss on native
  return (
    <Portal zIndex={zIndex}>
      <Theme forceClassName name={themeName}>
        {!!context.open && !context.breakpointActive && (
          <YStack
            fullscreen
            onPress={composeEventHandlers(props.onPress as any, context.onOpenToggle)}
          />
        )}
        <Stack zIndex={(zIndex as number) + 1}>{contents}</Stack>
      </Theme>
    </Portal>
  )
}

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

  disableRemoveScroll?: boolean
}

const PopoverContentImpl = React.forwardRef<
  PopoverContentImplElement,
  PopoverContentImplProps
>((props: ScopedPopoverProps<PopoverContentImplProps>, forwardedRef) => {
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
    disableRemoveScroll,
    ...contentProps
  } = props
  const popperScope = usePopoverScope(__scopePopover)
  const context = usePopoverInternalContext(CONTENT_NAME, popperScope.__scopePopover)

  if (context.breakpointActive) {
    // unwrap the PopoverScrollView if used, as it will use the SheetScrollView if that exists
    const childrenWithoutScrollView = React.Children.toArray(children).map((child) => {
      if (React.isValidElement(child)) {
        if (child.type === PopoverScrollView) {
          return child.props.children
        }
      }
      return child
    })

    // doesn't show as popover yet on native, must use as sheet
    return (
      <PortalItem hostName={`${context.scopeKey}SheetContents`}>
        {childrenWithoutScrollView}
      </PortalItem>
    )
  }

  // const handleDismiss = React.useCallback((event: GestureResponderEvent) =>{
  //   context.onOpenChange(false);
  // }, [])
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
          key={context.contentId}
          data-state={getState(context.open)}
          id={context.contentId}
          pointerEvents="auto"
          ref={forwardedRef}
          {...popperScope}
          {...contentProps}
        >
          <RemoveScroll
            enabled={disableRemoveScroll ? false : context.open}
            allowPinchZoom
            // causes lots of bugs on touch web on site
            removeScrollBar={false}
            style={{
              display: 'contents',
            }}
          >
            {trapFocus === false ? (
              children
            ) : (
              <FocusScope
                loop
                trapped={trapFocus ?? context.open}
                onMountAutoFocus={onOpenAutoFocus}
                onUnmountAutoFocus={onCloseAutoFocus}
              >
                {isWeb ? <div style={{ display: 'contents' }}>{children}</div> : children}
              </FocusScope>
            )}
          </RemoveScroll>
        </PopperContent>
      )}
    </AnimatePresence>
  )
})

/* -------------------------------------------------------------------------------------------------
 * PopoverClose
 * -----------------------------------------------------------------------------------------------*/

const CLOSE_NAME = 'PopoverClose'

type PopoverCloseElement = HTMLElement | View
export type PopoverCloseProps = YStackProps

export const PopoverClose = React.forwardRef<PopoverCloseElement, PopoverCloseProps>(
  (props: ScopedPopoverProps<PopoverCloseProps>, forwardedRef) => {
    const { __scopePopover, ...closeProps } = props
    const context = usePopoverInternalContext(CLOSE_NAME, __scopePopover)
    return (
      <YStack
        {...closeProps}
        ref={forwardedRef}
        onPress={composeEventHandlers(props.onPress as any, () =>
          context.onOpenChange(false)
        )}
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
  (props: ScopedPopoverProps<PopoverArrowProps>, forwardedRef) => {
    const { __scopePopover, ...arrowProps } = props
    const popperScope = usePopoverScope(__scopePopover)
    return <PopperArrow {...popperScope} {...arrowProps} ref={forwardedRef} />
  }
)

PopoverArrow.displayName = ARROW_NAME

/* -------------------------------------------------------------------------------------------------
 * PopoverScrollView
 * -----------------------------------------------------------------------------------------------*/

export const PopoverScrollView = React.forwardRef<ScrollView, ScrollViewProps>(
  (props, ref) => {
    return <ScrollView ref={ref} {...props} />
  }
)

/* -------------------------------------------------------------------------------------------------
 * Popover
 * -----------------------------------------------------------------------------------------------*/

/* -----------------------------------------------------------------------------------------------*/

function getState(open: boolean) {
  return open ? 'open' : 'closed'
}

export const PopoverSheetController = (
  props: ScopedPopoverProps<{
    children: React.ReactNode
    onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
  }>
) => {
  const context = usePopoverInternalContext(
    'PopoverSheetController',
    props.__scopePopover
  )
  const showSheet = useShowPopoverSheet(context)
  const breakpointActive = context.breakpointActive
  const getShowSheet = useGet(showSheet)
  return (
    <SheetController
      onOpenChange={(val) => {
        if (getShowSheet()) {
          props.onOpenChange(val)
        }
      }}
      open={context.open}
      hidden={breakpointActive === false}
    >
      {props.children}
    </SheetController>
  )
}

export const useSheetBreakpointActive = (breakpoint?: MediaQueryKey | null | boolean) => {
  const media = useMedia()
  if (typeof breakpoint === 'boolean' || !breakpoint) {
    return !!breakpoint
  }
  return media[breakpoint]
}

const useShowPopoverSheet = (context: PopoverContextValue) => {
  const breakpointActive = useSheetBreakpointActive(context.sheetBreakpoint)
  return context.open === false ? false : breakpointActive
}
