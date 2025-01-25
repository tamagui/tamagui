import '@tamagui/polyfill-dev'

import type { UseHoverProps } from '@floating-ui/react'
import {
  Adapt,
  AdaptParent,
  AdaptPortalContents,
  ProvideAdaptContext,
  useAdaptContext,
  useAdaptIsActive,
  type AdaptParentContextI,
} from '@tamagui/adapt'

import { Animate } from '@tamagui/animate'
import { ResetPresence } from '@tamagui/animate-presence'
import { hideOthers } from '@tamagui/aria-hidden'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb } from '@tamagui/constants'
import type { ScopedProps, SizeTokens, StackProps, TamaguiElement } from '@tamagui/core'
import {
  Stack,
  Theme,
  View,
  createShallowSetState,
  createStyledContext,
  useEvent,
  useGet,
  useThemeName,
} from '@tamagui/core'
import type { DismissableProps } from '@tamagui/dismissable'
import { FloatingOverrideContext } from '@tamagui/floating'
import type { FocusScopeProps } from '@tamagui/focus-scope'
import { FocusScope } from '@tamagui/focus-scope'
import { composeEventHandlers, withStaticProperties } from '@tamagui/helpers'
import type {
  PopperArrowExtraProps,
  PopperArrowProps,
  PopperContentProps,
  PopperProps,
} from '@tamagui/popper'
import {
  Popper,
  PopperAnchor,
  PopperArrow,
  PopperContent,
  PopperContentFrame,
  PopperContext,
  usePopperContext,
} from '@tamagui/popper'
import { Portal } from '@tamagui/portal'
import type { RemoveScrollProps } from '@tamagui/remove-scroll'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { Sheet, SheetController } from '@tamagui/sheet'
import type { YStackProps } from '@tamagui/stacks'
import { YStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import * as React from 'react'
import { Platform, ScrollView } from 'react-native'

import { useFloatingContext } from './useFloatingContext'

// adapted from radix-ui popover

export type PopoverProps = PopperProps & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, via?: 'hover' | 'press') => void
  keepChildrenMounted?: boolean

  /**
   * Enable staying open while mouseover
   */
  hoverable?: boolean | UseHoverProps

  /**
   * Disable focusing behavior on open
   */
  disableFocus?: boolean
}

type ScopedPopoverProps<P> = ScopedProps<P, 'Popover'>

type PopoverContextValue = {
  id: string
  triggerRef: React.RefObject<any>
  contentId?: string
  open: boolean
  onOpenChange(open: boolean, via: 'hover' | 'press'): void
  onOpenToggle(): void
  hasCustomAnchor: boolean
  onCustomAnchorAdd(): void
  onCustomAnchorRemove(): void
  size?: SizeTokens
  breakpointActive?: boolean
  keepChildrenMounted?: boolean
  anchorTo?: Rect
}

const POPOVER_SCOPE = 'PopoverScope'

export const PopoverContext = createStyledContext<PopoverContextValue>({} as any)

export const usePopoverContext = PopoverContext.useStyledContext

/* -------------------------------------------------------------------------------------------------
 * PopoverAnchor
 * -----------------------------------------------------------------------------------------------*/

export type PopoverAnchorProps = YStackProps

export const PopoverAnchor = React.forwardRef<
  TamaguiElement,
  ScopedPopoverProps<PopoverAnchorProps>
>(function PopoverAnchor(props: ScopedPopoverProps<PopoverAnchorProps>, forwardedRef) {
  const { __scopePopover, ...rest } = props
  const context = usePopoverContext(__scopePopover)
  const { onCustomAnchorAdd, onCustomAnchorRemove } = context || {}

  React.useEffect(() => {
    onCustomAnchorAdd()
    return () => onCustomAnchorRemove()
  }, [onCustomAnchorAdd, onCustomAnchorRemove])

  return (
    <PopperAnchor
      __scopePopper={__scopePopover || POPOVER_SCOPE}
      {...rest}
      ref={forwardedRef}
    />
  )
})

/* -------------------------------------------------------------------------------------------------
 * PopoverTrigger
 * -----------------------------------------------------------------------------------------------*/

export type PopoverTriggerProps = StackProps

export const PopoverTrigger = React.forwardRef<
  TamaguiElement,
  ScopedPopoverProps<PopoverTriggerProps>
>(function PopoverTrigger(props: ScopedPopoverProps<PopoverTriggerProps>, forwardedRef) {
  const { __scopePopover, ...rest } = props
  const context = usePopoverContext(__scopePopover)
  const anchorTo = context.anchorTo

  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef)

  if (!props.children) return null

  const trigger = (
    <View
      aria-expanded={context.open}
      // TODO not matching
      // aria-controls={context.contentId}
      data-state={getState(context.open)}
      {...rest}
      // @ts-ignore
      ref={composedTriggerRef}
      onPress={composeEventHandlers(props.onPress as any, context.onOpenToggle)}
    />
  )

  if (anchorTo) {
    const virtualRef = {
      current: {
        getBoundingClientRect: () => (isWeb ? DOMRect.fromRect(anchorTo) : anchorTo),
        ...(!isWeb && {
          measure: (c) => c(anchorTo?.x, anchorTo?.y, anchorTo?.width, anchorTo?.height),
          measureInWindow: (c) =>
            c(anchorTo?.x, anchorTo?.y, anchorTo?.width, anchorTo?.height),
        }),
      },
    }
    return (
      <PopperAnchor
        virtualRef={virtualRef}
        __scopePopper={__scopePopover || POPOVER_SCOPE}
      >
        {trigger}
      </PopperAnchor>
    )
  }

  return context.hasCustomAnchor ? (
    trigger
  ) : (
    <PopperAnchor __scopePopper={__scopePopover || POPOVER_SCOPE} asChild>
      {trigger}
    </PopperAnchor>
  )
})

/* -------------------------------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

export type PopoverContentProps = PopoverContentTypeProps

type PopoverContentTypeElement = PopoverContentImplElement

export interface PopoverContentTypeProps
  extends Omit<PopoverContentImplProps, 'disableOutsidePointerEvents'> {
  /**
   * @see https://github.com/theKashey/react-remove-scroll#usage
   */
  allowPinchZoom?: RemoveScrollProps['allowPinchZoom']
  /** enable animation for content position changing */
  enableAnimationForPositionChange?: boolean
}

export const PopoverContent = PopperContentFrame.extractable(
  React.forwardRef<
    PopoverContentTypeElement,
    ScopedPopoverProps<PopoverContentTypeProps>
  >(function PopoverContent(
    props: ScopedPopoverProps<PopoverContentTypeProps>,
    forwardedRef
  ) {
    const {
      allowPinchZoom,
      trapFocus,
      disableRemoveScroll = true,
      zIndex,
      __scopePopover,
      ...contentImplProps
    } = props
    const context = usePopoverContext(__scopePopover)
    const contentRef = React.useRef<any>(null)
    const composedRefs = useComposedRefs(forwardedRef, contentRef)
    const isRightClickOutsideRef = React.useRef(false)
    const [isFullyHidden, setIsFullyHidden] = React.useState(!context.open)

    if (context.open && isFullyHidden) {
      setIsFullyHidden(false)
    }

    // aria-hide everything except the content (better supported equivalent to setting aria-modal)
    React.useEffect(() => {
      if (!context.open) return
      const content = contentRef.current
      if (content) return hideOthers(content)
    }, [context.open])

    if (!context.keepChildrenMounted) {
      if (isFullyHidden) {
        return null
      }
    }

    return (
      <PopoverContentPortal __scopePopover={__scopePopover} zIndex={props.zIndex}>
        <Stack pointerEvents={context.open ? 'auto' : 'none'}>
          <PopoverContentImpl
            {...contentImplProps}
            disableRemoveScroll={disableRemoveScroll}
            ref={composedRefs}
            setIsFullyHidden={setIsFullyHidden}
            __scopePopover={__scopePopover}
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
        </Stack>
      </PopoverContentPortal>
    )
  })
)

function PopoverRepropagateContext(props: {
  children: any
  context: any
  popperContext: any
  scope: string
  adaptContext: AdaptParentContextI
}) {
  return (
    <PopperContext.Provider scope={props.scope} {...props.popperContext}>
      <PopoverContext.Provider {...props.context}>
        <ProvideAdaptContext {...props.adaptContext}>
          {props.children}
        </ProvideAdaptContext>
      </PopoverContext.Provider>
    </PopperContext.Provider>
  )
}

function PopoverContentPortal(props: ScopedPopoverProps<PopoverContentTypeProps>) {
  const { __scopePopover } = props
  const zIndex = props.zIndex ?? 150_000
  const context = usePopoverContext(__scopePopover)
  const popperContext = usePopperContext(__scopePopover || POPOVER_SCOPE)
  const themeName = useThemeName()
  const adaptContext = useAdaptContext()

  let contents = props.children

  // native doesnt support portals
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    contents = (
      <PopoverRepropagateContext
        scope={__scopePopover || POPOVER_SCOPE}
        popperContext={popperContext}
        context={context}
        adaptContext={adaptContext}
      >
        {props.children}
      </PopoverRepropagateContext>
    )
  }

  // Portal the contents and add a transparent bg overlay to handle dismiss on native
  return (
    <Portal zIndex={zIndex}>
      {/* forceClassName avoids forced re-mount renders for some reason... see the HeadMenu as you change tints a few times */}
      {/* without this you'll see the site menu re-rendering. It must be something in wrapping children in Theme */}
      <Theme forceClassName name={themeName}>
        {!!context.open && !context.breakpointActive && (
          <YStack
            fullscreen
            onPress={composeEventHandlers(props.onPress as any, context.onOpenToggle)}
          />
        )}
        {contents}
      </Theme>
    </Portal>
  )
}
/* -----------------------------------------------------------------------------------------------*/

type PopoverContentImplElement = React.ElementRef<typeof PopperContent>

export interface PopoverContentImplProps
  extends PopperContentProps,
    Omit<DismissableProps, 'onDismiss' | 'children' | 'onPointerDownCapture'> {
  /**
   * Whether focus should be trapped within the `Popover`
   * @default false
   */
  trapFocus?: FocusScopeProps['trapped']

  /**
   * Whether popover should not focus contents on open
   * @default false
   */
  disableFocusScope?: boolean

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

  freezeContentsWhenHidden?: boolean

  setIsFullyHidden?: React.Dispatch<React.SetStateAction<boolean>>
}

const PopoverContentImpl = React.forwardRef<
  PopoverContentImplElement,
  ScopedPopoverProps<PopoverContentImplProps>
>(function PopoverContentImpl(
  props: ScopedPopoverProps<PopoverContentImplProps>,
  forwardedRef
) {
  const {
    trapFocus,
    __scopePopover,
    onOpenAutoFocus,
    onCloseAutoFocus,
    disableOutsidePointerEvents,
    disableFocusScope,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    children,
    disableRemoveScroll,
    freezeContentsWhenHidden,
    setIsFullyHidden,
    ...contentProps
  } = props

  const context = usePopoverContext(__scopePopover)
  const { open, keepChildrenMounted } = context
  const popperContext = usePopperContext(__scopePopover || POPOVER_SCOPE)

  const handleExitComplete = React.useCallback(() => {
    setIsFullyHidden?.(true)
  }, [setIsFullyHidden])

  let contents = <ResetPresence>{children}</ResetPresence>

  if (context.breakpointActive) {
    // unwrap the PopoverScrollView if used, as it will use the SheetScrollView if that exists
    // TODO this should be disabled through context
    const childrenWithoutScrollView = React.Children.toArray(children).map((child) => {
      if (React.isValidElement(child)) {
        if (child.type === ScrollView) {
          return child.props.children
        }
      }
      return child
    })

    return (
      <AdaptPortalContents>
        <PopperContext.Provider
          scope={__scopePopover || POPOVER_SCOPE}
          {...popperContext}
        >
          {childrenWithoutScrollView}
        </PopperContext.Provider>
      </AdaptPortalContents>
    )
  }

  if (process.env.TAMAGUI_TARGET !== 'native') {
    contents = (
      <RemoveScroll
        enabled={disableRemoveScroll ? false : open}
        allowPinchZoom
        // causes lots of bugs on touch web on site
        removeScrollBar={false}
        style={dspContentsStyle}
      >
        <FocusScope
          loop
          enabled={disableFocusScope ? false : open}
          trapped={trapFocus}
          onMountAutoFocus={onOpenAutoFocus}
          onUnmountAutoFocus={onCloseAutoFocus}
        >
          <div style={dspContentsStyle}>{contents}</div>
        </FocusScope>
      </RemoveScroll>
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

  // const freeze = Boolean(isFullyHidden && freezeContentsWhenHidden)

  return (
    <Animate
      type="presence"
      present={Boolean(open)}
      keepChildrenMounted={keepChildrenMounted}
      onExitComplete={handleExitComplete}
    >
      <PopperContent
        __scopePopper={__scopePopover || POPOVER_SCOPE}
        key={context.contentId}
        data-state={getState(open)}
        id={context.contentId}
        ref={forwardedRef}
        {...contentProps}
      >
        {contents}
      </PopperContent>
    </Animate>
  )
})

const dspContentsStyle = {
  display: 'contents',
}

/* -------------------------------------------------------------------------------------------------
 * PopoverClose
 * -----------------------------------------------------------------------------------------------*/

export type PopoverCloseProps = YStackProps

export const PopoverClose = React.forwardRef<
  TamaguiElement,
  ScopedPopoverProps<PopoverCloseProps>
>(function PopoverClose(props: ScopedPopoverProps<PopoverCloseProps>, forwardedRef) {
  const { __scopePopover, ...rest } = props
  const context = usePopoverContext(__scopePopover)
  return (
    <YStack
      {...rest}
      ref={forwardedRef}
      componentName="PopoverClose"
      onPress={composeEventHandlers(props.onPress as any, () =>
        context.onOpenChange(false, 'press')
      )}
    />
  )
})

/* -------------------------------------------------------------------------------------------------
 * PopoverArrow
 * -----------------------------------------------------------------------------------------------*/

export type PopoverArrowProps = PopperArrowProps

export const PopoverArrow = PopperArrow.styleable<PopperArrowExtraProps>(
  function PopoverArrow(props: ScopedPopoverProps<PopoverArrowProps>, forwardedRef) {
    const { __scopePopover, ...rest } = props
    const isAdapted = useAdaptIsActive()
    if (isAdapted) {
      return null
    }
    return (
      <PopperArrow
        __scopePopper={__scopePopover || POPOVER_SCOPE}
        componentName="PopoverArrow"
        {...rest}
        ref={forwardedRef}
      />
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * Popover
 * -----------------------------------------------------------------------------------------------*/

type Rect = {
  x: number
  y: number
  width: number
  height: number
}

export type Popover = {
  anchorTo: (rect: Rect) => void
  toggle: () => void
  open: () => void
  close: () => void
  setOpen: (open: boolean) => void
}

export const Popover = withStaticProperties(
  React.forwardRef<Popover, ScopedPopoverProps<PopoverProps>>(
    function Popover(props, ref) {
      const id = React.useId()

      return (
        <AdaptParent scope={`${id}PopoverContents`} portal>
          <PopoverInner ref={ref} id={id} {...props} />
        </AdaptParent>
      )
    }
  ),
  {
    Anchor: PopoverAnchor,
    Arrow: PopoverArrow,
    Trigger: PopoverTrigger,
    Content: PopoverContent,
    Close: PopoverClose,
    Adapt,
    ScrollView: ScrollView,
    Sheet: Sheet.Controlled,
  }
)

const PopoverInner = React.forwardRef<
  Popover,
  ScopedPopoverProps<PopoverProps> & { id: string }
>(function PopoverInner(props, forwardedRef) {
  const {
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    __scopePopover,
    keepChildrenMounted,
    hoverable,
    disableFocus,
    id,
    ...restProps
  } = props

  const triggerRef = React.useRef<TamaguiElement>(null)
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false)
  const viaRef = React.useRef()
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen || false,
    onChange: (val) => {
      onOpenChange?.(val, viaRef.current)
    },
  })

  const handleOpenChange = useEvent((val, via) => {
    viaRef.current = via
    setOpen(val)
  })

  const isAdapted = useAdaptIsActive()

  const floatingContext = useFloatingContext({
    open,
    setOpen: handleOpenChange,
    disable: isAdapted,
    hoverable,
    disableFocus: disableFocus,
  }) as any

  const [anchorTo, setAnchorToRaw] = React.useState<Rect>()

  const setAnchorTo = createShallowSetState(
    setAnchorToRaw as any
  ) as typeof setAnchorToRaw

  React.useImperativeHandle(forwardedRef, () => ({
    anchorTo: setAnchorTo,
    toggle: () => setOpen((prev) => !prev),
    open: () => setOpen(true),
    close: () => setOpen(false),
    setOpen,
  }))

  // needs to be entirely memoized!
  const popoverContext = {
    id,
    contentId: React.useId(),
    triggerRef,
    open,
    breakpointActive: isAdapted,
    onOpenChange: handleOpenChange,
    onOpenToggle: useEvent(() => {
      if (open && isAdapted) {
        return
      }
      setOpen(!open)
    }),
    hasCustomAnchor,
    anchorTo,
    onCustomAnchorAdd: React.useCallback(() => setHasCustomAnchor(true), []),
    onCustomAnchorRemove: React.useCallback(() => setHasCustomAnchor(false), []),
    keepChildrenMounted,
  }

  // // debug if changing too often
  // if (process.env.NODE_ENV === 'development') {
  //   Object.keys(popoverContext).forEach((key) => {
  //     React.useEffect(
  //       () => console.log(`changed`, key, popoverContext[key]),
  //       [popoverContext[key]]
  //     )
  //   })
  // }

  const contents = (
    <Popper __scopePopper={__scopePopover || POPOVER_SCOPE} stayInFrame {...restProps}>
      <PopoverContext.Provider scope={__scopePopover} {...popoverContext}>
        <PopoverSheetController onOpenChange={setOpen}>{children}</PopoverSheetController>
      </PopoverContext.Provider>
    </Popper>
  )

  return (
    <>
      {isWeb ? (
        <FloatingOverrideContext.Provider value={floatingContext}>
          {contents}
        </FloatingOverrideContext.Provider>
      ) : (
        contents
      )}
    </>
  )
})

/* -----------------------------------------------------------------------------------------------*/

function getState(open: boolean) {
  return open ? 'open' : 'closed'
}

const PopoverSheetController = ({
  __scopePopover,
  ...props
}: ScopedPopoverProps<{
  children: React.ReactNode
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}>) => {
  const context = usePopoverContext(__scopePopover)
  const showSheet = useShowPopoverSheet(context)
  const breakpointActive = context.breakpointActive
  const getShowSheet = useGet(showSheet)

  return (
    <SheetController
      onOpenChange={(val) => {
        if (getShowSheet()) {
          props.onOpenChange?.(val)
        }
      }}
      open={context.open}
      hidden={breakpointActive === false}
    >
      {props.children}
    </SheetController>
  )
}

const useShowPopoverSheet = (context: PopoverContextValue) => {
  const isAdapted = useAdaptIsActive()
  return context.open === false ? false : isAdapted
}
