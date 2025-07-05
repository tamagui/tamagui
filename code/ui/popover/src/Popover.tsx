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
import { isAndroid, isIos, isWeb } from '@tamagui/constants'
import type { ScopedProps, SizeTokens, StackProps, TamaguiElement } from '@tamagui/core'
import {
  createStyledContext,
  Stack,
  Theme,
  useCreateShallowSetState,
  useEvent,
  useGet,
  useThemeName,
  View,
} from '@tamagui/core'
import type { DismissableProps } from '@tamagui/dismissable'
import { FloatingOverrideContext } from '@tamagui/floating'
import type { FocusScopeProps } from '@tamagui/focus-scope'
import { FocusScope, FocusScopeController } from '@tamagui/focus-scope'
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
import { Portal, resolveViewZIndex, USE_NATIVE_PORTAL } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import type { ScrollView, ScrollViewProps } from '@tamagui/scroll-view'
import { Sheet, SheetController } from '@tamagui/sheet'
import type { YStackProps } from '@tamagui/stacks'
import { YStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import { StackZIndexContext } from '@tamagui/z-index-stack'
import * as React from 'react'
import { useFloatingContext } from './useFloatingContext'

// adapted from radix-ui popover

const needsRepropagation = isAndroid || (isIos && !USE_NATIVE_PORTAL)

type PopoverVia = 'hover' | 'press'

export type PopoverProps = PopperProps & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean, via?: PopoverVia) => void

  /**
   * When true, children never un-mount, otherwise they mount on open.
   * When "lazy", they mount inside a startTransition after first render.
   *
   * @default false
   */
  keepChildrenMounted?: boolean | 'lazy'

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
  keepChildrenMounted?: boolean | 'lazy'
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

  if (!props.children) {
    return null
  }

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

  const virtualRef = React.useMemo(() => {
    if (!anchorTo) {
      return null
    }
    return {
      current: {
        getBoundingClientRect: () => (isWeb ? DOMRect.fromRect(anchorTo) : anchorTo),
        ...(!isWeb && {
          measure: (c) => c(anchorTo?.x, anchorTo?.y, anchorTo?.width, anchorTo?.height),
          measureInWindow: (c) =>
            c(anchorTo?.x, anchorTo?.y, anchorTo?.width, anchorTo?.height),
        }),
      },
    }
  }, [
    context.anchorTo,
    anchorTo?.x,
    anchorTo?.y,
    anchorTo?.x,
    anchorTo?.height,
    anchorTo?.width,
  ])

  return context.hasCustomAnchor ? (
    trigger
  ) : (
    <PopperAnchor
      {...(virtualRef && { virtualRef })}
      __scopePopper={__scopePopover || POPOVER_SCOPE}
      asChild={rest.asChild}
    >
      {trigger}
    </PopperAnchor>
  )
})

/* -------------------------  ------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

export type PopoverContentProps = PopoverContentTypeProps

type PopoverContentTypeElement = PopoverContentImplElement

export interface PopoverContentTypeProps
  extends Omit<PopoverContentImplProps, 'disableOutsidePointerEvents'> {
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
      trapFocus,
      enableRemoveScroll = false,
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
      <PopoverContentPortal __scopePopover={__scopePopover} zIndex={zIndex}>
        <Stack
          pointerEvents={
            context.open ? (contentImplProps.pointerEvents ?? 'auto') : 'none'
          }
        >
          <PopoverContentImpl
            {...contentImplProps}
            enableRemoveScroll={enableRemoveScroll}
            ref={composedRefs}
            setIsFullyHidden={setIsFullyHidden}
            __scopePopover={__scopePopover}
            // we make sure we're not trapping once it's been closed
            // (closed !== unmounted when animating out)
            trapFocus={trapFocus ?? context.open}
            disableOutsidePointerEvents
            onCloseAutoFocus={
              props.onCloseAutoFocus === false
                ? undefined
                : composeEventHandlers(props.onCloseAutoFocus, (event) => {
                    if (event.defaultPrevented) return
                    event.preventDefault()
                    if (!isRightClickOutsideRef.current)
                      context.triggerRef.current?.focus()
                  })
            }
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
  scope: string
  adaptContext: AdaptParentContextI
  zIndex: any
}) {
  const popperContext = usePopperContext(props.scope || POPOVER_SCOPE)

  return (
    <PopperContext.Provider scope={props.scope} {...popperContext}>
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
  const zIndex = props.zIndex
  const context = usePopoverContext(__scopePopover)
  const themeName = useThemeName()
  const adaptContext = useAdaptContext()

  let contents = props.children

  const isPopover = !context.breakpointActive
  const isSheet = context.breakpointActive

  // native doesnt support portals
  if (needsRepropagation) {
    contents = (
      <PopoverRepropagateContext
        scope={__scopePopover || POPOVER_SCOPE}
        context={context}
        adaptContext={adaptContext}
        zIndex={zIndex}
      >
        {props.children}
      </PopoverRepropagateContext>
    )
  }

  // portal is for popover
  // theme is and overlay are for sheet
  return (
    <Portal stackZIndex zIndex={zIndex}>
      {/* forceClassName avoids forced re-mount renders for some reason... see the HeadMenu as you change tints a few times */}
      {/* without this you'll see the site menu re-rendering. It must be something in wrapping children in Theme */}
      <Theme passThrough={isPopover} forceClassName name={themeName}>
        {!!context.open && isSheet && (
          <YStack
            fullscreen
            onPress={composeEventHandlers(props.onPress as any, context.onOpenToggle)}
          />
        )}
        <StackZIndexContext zIndex={resolveViewZIndex(zIndex)}>
          {contents}
        </StackZIndexContext>
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
   * Rather than mount the content immediately, mounts it in a useEffect
   * inside a startTransition to clear the main thread
   */
  lazyMount?: boolean

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
   * Event handler called when auto-focusing on open. Can be prevented.
   */
  onOpenAutoFocus?: FocusScopeProps['onMountAutoFocus']

  /**
   * Event handler called when auto-focusing on close. Can be prevented.
   */
  onCloseAutoFocus?: FocusScopeProps['onUnmountAutoFocus'] | false

  enableRemoveScroll?: boolean

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
    enableRemoveScroll,
    freezeContentsWhenHidden,
    setIsFullyHidden,
    lazyMount,
    ...contentProps
  } = props

  const context = usePopoverContext(__scopePopover)

  const { open, keepChildrenMounted } = context

  const handleExitComplete = React.useCallback(() => {
    setIsFullyHidden?.(true)
  }, [setIsFullyHidden])

  let contents = (
    <ResetPresence disable={context.breakpointActive}>{children}</ResetPresence>
  )

  // i want to avoid reparenting but react-remove-scroll makes it hard
  if (!context.breakpointActive) {
    if (process.env.TAMAGUI_TARGET !== 'native') {
      contents = (
        <RemoveScroll
          enabled={context.breakpointActive ? false : enableRemoveScroll ? open : false}
        >
          <FocusScope
            loop
            enabled={context.breakpointActive ? false : disableFocusScope ? false : open}
            trapped={context.breakpointActive ? false : trapFocus}
            onMountAutoFocus={onOpenAutoFocus}
            onUnmountAutoFocus={onCloseAutoFocus === false ? undefined : onCloseAutoFocus}
          >
            <div style={dspContentsStyle}>{contents}</div>
          </FocusScope>
        </RemoveScroll>
      )
    }
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
    <RepropagatePopperAdapt __scopePopover={__scopePopover || POPOVER_SCOPE}>
      <Animate
        type="presence"
        present={Boolean(open)}
        keepChildrenMounted={Boolean(keepChildrenMounted)}
        onExitComplete={handleExitComplete}
        lazyMount={lazyMount}
        passThrough={context.breakpointActive}
      >
        <PopperContent
          __scopePopper={__scopePopover || POPOVER_SCOPE}
          key={context.contentId}
          data-state={getState(open)}
          id={context.contentId}
          ref={forwardedRef}
          passThrough={context.breakpointActive}
          {...contentProps}
        >
          {contents}
        </PopperContent>
      </Animate>
    </RepropagatePopperAdapt>
  )
})

const RepropagatePopperAdapt = ({
  children,
  __scopePopover,
}: ScopedPopoverProps<{ children?: React.ReactNode }>) => {
  if (needsRepropagation) {
    const popperContext = usePopperContext(__scopePopover || POPOVER_SCOPE)

    return (
      <AdaptPortalContents>
        <PopperContext.Provider {...popperContext}>{children}</PopperContext.Provider>
      </AdaptPortalContents>
    )
  }

  return <AdaptPortalContents>{children}</AdaptPortalContents>
}

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
        context?.onOpenChange?.(false, 'press')
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

const PopoverScrollView = React.forwardRef<ScrollView, ScrollViewProps>(
  (props: ScrollViewProps, ref) => {
    const context = usePopoverContext(POPOVER_SCOPE)

    return props.children
    // return (
    //   <ScrollView
    //     ref={ref}
    //     // when adapted, no pointer events!
    //     pointerEvents={context.breakpointActive ? 'none' : undefined}
    //     scrollEnabled={!context.breakpointActive}
    //     passThrough={context.breakpointActive}
    //     {...props}
    //   />
    // )
  }
)

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
    ScrollView: PopoverScrollView,
    Sheet: Sheet.Controlled,
    FocusScope: FocusScopeController,
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
    keepChildrenMounted: keepChildrenMountedProp,
    hoverable,
    disableFocus,
    id,
    ...restProps
  } = props

  const triggerRef = React.useRef<TamaguiElement>(null)
  const [hasCustomAnchor, setHasCustomAnchor] = React.useState(false)
  const viaRef = React.useRef<PopoverVia>(undefined)
  const [keepChildrenMounted] = useControllableState({
    prop: keepChildrenMountedProp,
    defaultProp: false,
    transition: keepChildrenMountedProp === 'lazy',
  })
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

  const setAnchorTo = useCreateShallowSetState(
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

  const memoizedChildren = React.useMemo(() => {
    return (
      <PopoverContext.Provider scope={__scopePopover} {...popoverContext}>
        <PopoverSheetController onOpenChange={setOpen}>{children}</PopoverSheetController>
      </PopoverContext.Provider>
    )
  }, [setOpen, children, ...Object.values(popoverContext)])

  const contents = (
    <Popper
      open={open}
      passThrough={isAdapted}
      __scopePopper={__scopePopover || POPOVER_SCOPE}
      stayInFrame
      {...restProps}
    >
      {memoizedChildren}
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
      hidden={!breakpointActive}
    >
      {props.children}
    </SheetController>
  )
}

const useShowPopoverSheet = (context: PopoverContextValue) => {
  const isAdapted = useAdaptIsActive()
  return context.open === false ? false : isAdapted
}
