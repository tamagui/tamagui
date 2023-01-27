// adapted from radix-ui popover

import '@tamagui/polyfill-dev'

import { Adapt, useAdaptParent } from '@tamagui/adapt'
import { AnimatePresence } from '@tamagui/animate-presence'
import { hideOthers } from '@tamagui/aria-hidden'
import { useComposedRefs } from '@tamagui/compose-refs'
import {
  GestureReponderEvent,
  MediaQueryKey,
  SizeTokens,
  Stack,
  TamaguiElement,
  Theme,
  composeEventHandlers,
  isWeb,
  useEvent,
  useGet,
  useId,
  useMedia,
  useThemeName,
  withStaticProperties,
} from '@tamagui/core'
import type { Scope } from '@tamagui/create-context'
import { createContextScope } from '@tamagui/create-context'
import { DismissableProps } from '@tamagui/dismissable'
import { FocusScope, FocusScopeProps } from '@tamagui/focus-scope'
import {
  Popper,
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
import { FloatingOverrideContext } from '@tamagui/floating'
import { Portal, PortalHost, PortalItem } from '@tamagui/portal'
import { RemoveScroll, RemoveScrollProps } from '@tamagui/remove-scroll'
import { ControlledSheet, SheetController } from '@tamagui/sheet'
import { SizableStack, XStack, YStack, YStackProps, ZStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'
import { GestureResponderEvent, Platform, ScrollView, ScrollViewProps, View } from 'react-native'

import type { UseFloatingProps } from '@floating-ui/react-dom-interactions'
import { useDismiss, useInteractions, useRole, useFloating } from '@floating-ui/react-dom-interactions'
import { useEffect } from 'react'

const POPOVER_NAME = 'Popover'

type ScopedProps<P> = P & { __scopePopover?: Scope }

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

export const PopoverTrigger = React.forwardRef<
  PopoverTriggerElement,
  PopoverTriggerProps
>((props: ScopedProps<PopoverTriggerProps>, forwardedRef) => {
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
>((props: ScopedProps<PopoverContentTypeProps>, forwardedRef) => {
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
    <PopoverContentPortal zIndex={zIndex ?? 10000}>
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

function PopoverContentPortal(props: ScopedProps<PopoverContentTypeProps>) {
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

  const { zIndex } = props;

  // Portal the contents and add a transparent bg overlay to handle dismiss on native
  return (
    <Portal>
      <Theme forceClassName name={themeName}>
        {!!context.open && !context.breakpointActive &&
          <YStack
            zIndex={zIndex}
            fullscreen
            onPress={composeEventHandlers(props.onPress as any, context.onOpenToggle)}
          />
        }
        <Stack zIndex={zIndex as number+1}>{contents}</Stack>
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
>((props: ScopedProps<PopoverContentImplProps>, forwardedRef) => {
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
  (props: ScopedProps<PopoverCloseProps>, forwardedRef) => {
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
  (props: ScopedProps<PopoverArrowProps>, forwardedRef) => {
    // we dont show on native and i'm getting an err
    // if (!isWeb) {
    //   return null
    // }

    const { __scopePopover, ...arrowProps } = props
    const popperScope = usePopoverScope(__scopePopover)
    return <PopperArrow {...popperScope} {...arrowProps} ref={forwardedRef} />
  }
)

PopoverArrow.displayName = ARROW_NAME

/* -------------------------------------------------------------------------------------------------
 * PopoverScrollView
 * -----------------------------------------------------------------------------------------------*/

const PopoverScrollView = React.forwardRef<ScrollView, ScrollViewProps>((props, ref) => {
  return <ScrollView ref={ref} {...props} />
})

/* -------------------------------------------------------------------------------------------------
 * Popover
 * -----------------------------------------------------------------------------------------------*/

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

    const internalId = useId()
    const id = __scopePopover ? Object.keys(__scopePopover)[0] : internalId

    const { when, AdaptProvider } = useAdaptParent({
      Contents: React.useCallback(() => {
        return <PortalHost name={`${id}SheetContents`} />
      }, []),
    })

    const sheetBreakpoint = when
    const popperScope = usePopoverScope(__scopePopover)
    const triggerRef = React.useRef<TamaguiElement>(null)
    const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false)
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen || false,
      onChange: onOpenChange,
      transition: true,
    })

    const breakpointActive = useSheetBreakpointActive(sheetBreakpoint)


    // Custom floating context to override the Popper on web
    const useFloatingContext = React.useCallback(
      (props: UseFloatingProps) => {
        const floating = useFloating({
          ...props,
          open,
          onOpenChange: setOpen,
        })
        const { getReferenceProps, getFloatingProps } = useInteractions([
          // useFocus(floating.context, {
          //   enabled: !breakpointActive,
          //   keyboardOnly: true,
          // }),
          useRole(floating.context, { role: 'dialog' }),
          useDismiss(floating.context, {
            enabled: !breakpointActive,
          }),
        ])
        return {
          ...floating,
          getReferenceProps,
          getFloatingProps,
        }
      },
      [breakpointActive, open, setOpen]
    )

    const popoverContext = {
      scope: __scopePopover,
      scopeKey: id,
      popperScope: popperScope.__scopePopper,
      sheetBreakpoint,
      contentId: useId(),
      triggerRef,
      open,
      breakpointActive,
      onOpenChange: setOpen,
      onOpenToggle: useEvent(() => {
        if (open && breakpointActive) {
          return
        }
        setOpen(!open)
      }),
      hasCustomAnchor,
      onCustomAnchorAdd: React.useCallback(() => setHasCustomAnchor(true), []),
      onCustomAnchorRemove: React.useCallback(() => setHasCustomAnchor(false), []),
    }

    // debug if changing too often
    // if (process.env.NODE_ENV === 'development') {
    //   Object.keys(popoverContext).forEach((key) => {
    //     React.useEffect(() => console.log(`changed`, key), [popoverContext[key]])
    //   })
    // }

    const PopperStack = () => {
      return (
        <Popper {...popperScope} stayInFrame {...restProps}>
          <PopoverProviderInternal {...popoverContext}>
            <PopoverSheetController
              onOpenChange={setOpen}
              __scopePopover={__scopePopover}
            >
              {children}
            </PopoverSheetController>
          </PopoverProviderInternal>
        </Popper>
      )
    }

    const PopperWithFloatingOverride = () => {
      return (
        <FloatingOverrideContext.Provider value={useFloatingContext as any}>
          <PopperStack /> 
        </FloatingOverrideContext.Provider>
      )
    }

    return (
      <AdaptProvider>
        {isWeb ? <PopperWithFloatingOverride /> : <PopperStack />}
      </AdaptProvider>
    )
  }) as React.FC<PopoverProps>,
  {
    Anchor: PopoverAnchor,
    Arrow: PopoverArrow,
    Trigger: PopoverTrigger,
    Content: PopoverContent,
    Close: PopoverClose,
    Adapt,
    ScrollView: PopoverScrollView,
    Sheet: ControlledSheet,
  }
)

Popover.displayName = POPOVER_NAME

/* -----------------------------------------------------------------------------------------------*/

function getState(open: boolean) {
  return open ? 'open' : 'closed'
}

const PopoverSheetController = (
  props: ScopedProps<{
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

const useSheetBreakpointActive = (breakpoint?: MediaQueryKey | null | boolean) => {
  const media = useMedia()
  if (!breakpoint) return false
  if (breakpoint === true) return true
  return media[breakpoint]
}

const useShowPopoverSheet = (context: PopoverContextValue) => {
  const breakpointActive = useSheetBreakpointActive(context.sheetBreakpoint)
  return context.open === false ? false : breakpointActive
}
