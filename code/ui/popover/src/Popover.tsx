import '@tamagui/polyfill-dev'

import type { UseHoverProps } from '@floating-ui/react'
import {
  Adapt,
  AdaptParent,
  AdaptPortalContents,
  ProvideAdaptContext,
  useAdaptContext,
  useAdaptIsActive,
} from '@tamagui/adapt'
import { Animate } from '@tamagui/animate'
import { ResetPresence } from '@tamagui/animate-presence'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isAndroid, isIos, isWeb } from '@tamagui/constants'
import type { SizeTokens, StackProps, TamaguiElement } from '@tamagui/core'
import {
  createStyledContext,
  Stack,
  styled,
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
import {
  Popper,
  PopperAnchor,
  PopperArrow,
  type PopperArrowExtraProps,
  PopperArrowFrame,
  type PopperArrowProps,
  PopperContent,
  PopperContentFrame,
  type PopperContentProps,
  type PopperProps,
  PopperProvider,
  usePopperContext,
} from '@tamagui/popper'
import { Portal, resolveViewZIndex, USE_NATIVE_PORTAL } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { ScrollView, type ScrollViewProps } from '@tamagui/scroll-view'
import { Sheet, SheetController } from '@tamagui/sheet'
import type { YStackProps } from '@tamagui/stacks'
import { YStack } from '@tamagui/stacks'
import { useControllableState } from '@tamagui/use-controllable-state'
import { StackZIndexContext } from '@tamagui/z-index-stack'
import * as React from 'react'
import { useFloatingContext } from './useFloatingContext'

// adapted from radix-ui popover

type ScopedPopoverProps<P> = Omit<P, 'scope'> & {
  scope?: PopoverScopes
}

const needsRepropagation = isAndroid || (isIos && !USE_NATIVE_PORTAL)

type PopoverVia = 'hover' | 'press'

export type PopoverProps = ScopedPopoverProps<PopperProps> & {
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

// let users override for type safety
export type PopoverScopes = string

type PopoverContextValue = {
  popoverScope: string
  adaptScope: string
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

export const PopoverContext = createStyledContext<PopoverContextValue>(
  // since we always provide this we can avoid setting here
  {} as PopoverContextValue,
  'Popover__'
)

export const usePopoverContext = PopoverContext.useStyledContext

/* -------------------------------------------------------------------------------------------------
 * PopoverAnchor
 * -----------------------------------------------------------------------------------------------*/

export type PopoverAnchorProps = ScopedPopoverProps<YStackProps>

export const PopoverAnchor = React.forwardRef<TamaguiElement, PopoverAnchorProps>(
  function PopoverAnchor(props, forwardedRef) {
    const { scope, ...rest } = props
    const context = usePopoverContext(scope)
    const { onCustomAnchorAdd, onCustomAnchorRemove } = context || {}

    React.useEffect(() => {
      onCustomAnchorAdd()
      return () => onCustomAnchorRemove()
    }, [onCustomAnchorAdd, onCustomAnchorRemove])

    return <PopperAnchor scope={scope} {...rest} ref={forwardedRef} />
  }
)

/* -------------------------------------------------------------------------------------------------
 * PopoverTrigger
 * -----------------------------------------------------------------------------------------------*/

export type PopoverTriggerProps = ScopedPopoverProps<StackProps>

export const PopoverTrigger = React.forwardRef<TamaguiElement, PopoverTriggerProps>(
  function PopoverTrigger(props, forwardedRef) {
    const { scope, ...rest } = props
    const context = usePopoverContext(scope)

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
            measure: (c) =>
              c(anchorTo?.x, anchorTo?.y, anchorTo?.width, anchorTo?.height),
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
      <PopperAnchor {...(virtualRef && { virtualRef })} scope={scope} asChild>
        {trigger}
      </PopperAnchor>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

type PopoverContentTypeElement = PopoverContentImplElement

export interface PopoverContentTypeProps
  extends Omit<PopoverContentImplProps, 'disableOutsidePointerEvents'> {
  /** enable animation for content position changing */
  enableAnimationForPositionChange?: boolean
}

export type PopoverContentProps = PopoverContentTypeProps

const PopoverContentFrame = styled(PopperContentFrame, {
  name: 'Popover',
})

export const PopoverContent = PopoverContentFrame.extractable(
  React.forwardRef<PopoverContentTypeElement, PopoverContentProps>(
    function PopoverContent(props, forwardedRef) {
      const {
        trapFocus,
        enableRemoveScroll = false,
        zIndex,
        scope,
        ...contentImplProps
      } = props

      const context = usePopoverContext(scope)
      const contentRef = React.useRef<any>(null)
      const composedRefs = useComposedRefs(forwardedRef, contentRef)
      const isRightClickOutsideRef = React.useRef(false)
      const [isFullyHidden, setIsFullyHidden] = React.useState(!context.open)

      if (context.open && isFullyHidden) {
        setIsFullyHidden(false)
      }

      if (!context.keepChildrenMounted) {
        if (isFullyHidden) {
          return null
        }
      }

      return (
        <PopoverPortal
          passThrough={context.breakpointActive}
          context={context}
          zIndex={zIndex}
        >
          <Stack
            passThrough={context.breakpointActive}
            pointerEvents={
              context.open ? (contentImplProps.pointerEvents ?? 'auto') : 'none'
            }
          >
            <PopoverContentImpl
              {...contentImplProps}
              context={context}
              enableRemoveScroll={enableRemoveScroll}
              ref={composedRefs}
              setIsFullyHidden={setIsFullyHidden}
              scope={scope}
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
        </PopoverPortal>
      )
    }
  )
)

const useParentContexts = (scope: string) => {
  const context = usePopoverContext(scope)
  const popperContext = usePopperContext(scope)
  const adaptContext = useAdaptContext(context.adaptScope)
  return {
    popperContext,
    adaptContext,
    context,
  }
}

type ParentContexts = ReturnType<typeof useParentContexts>

function RepropagateParentContexts({
  adaptContext,
  children,
  context,
  popperContext,
}: ParentContexts & {
  children: React.ReactNode
}) {
  return (
    <PopperProvider scope={context.popoverScope} {...popperContext}>
      <PopoverContext.Provider {...context}>
        <ProvideAdaptContext {...adaptContext}>{children}</ProvideAdaptContext>
      </PopoverContext.Provider>
    </PopperProvider>
  )
}

const PortalAdaptSafe = ({
  children,
  context,
}: {
  children?: React.ReactNode
  context: PopoverContextValue
}) => {
  if (needsRepropagation) {
    const parentContexts = useParentContexts(context.popoverScope)
    return (
      <AdaptPortalContents scope={context.adaptScope}>
        <RepropagateParentContexts {...parentContexts}>
          {children}
        </RepropagateParentContexts>
      </AdaptPortalContents>
    )
  }

  return <AdaptPortalContents scope={context.adaptScope}>{children}</AdaptPortalContents>
}

function PopoverPortal({
  context,
  zIndex,
  passThrough,
  children,
  onPress,
}: Pick<PopoverContentProps, 'zIndex' | 'passThrough' | 'children' | 'onPress'> & {
  context: PopoverContextValue
}) {
  const themeName = useThemeName()

  let content = children

  // native doesnt support portals
  if (needsRepropagation) {
    const parentContexts = useParentContexts(context.popoverScope)

    content = (
      <RepropagateParentContexts {...parentContexts}>{content}</RepropagateParentContexts>
    )
  }

  return (
    <Portal passThrough={passThrough} stackZIndex zIndex={zIndex as any}>
      {/* forceClassName avoids forced re-mount renders for some reason... see the HeadMenu as you change tints a few times */}
      {/* without this you'll see the site menu re-rendering. It must be something in wrapping children in Theme */}
      <Theme passThrough={passThrough} contain forceClassName name={themeName}>
        {!!context.open && !context.breakpointActive && (
          <YStack
            fullscreen
            onPress={composeEventHandlers(onPress as any, context.onOpenToggle)}
          />
        )}

        <StackZIndexContext zIndex={resolveViewZIndex(zIndex)}>
          {content}
        </StackZIndexContext>
      </Theme>
    </Portal>
  )
}

/* -----------------------------------------------------------------------------------------------*/

type PopoverContentImplElement = React.ElementRef<typeof PopperContent>

export type PopoverContentImplProps = PopperContentProps &
  Omit<DismissableProps, 'onDismiss' | 'children' | 'onPointerDownCapture'> & {
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
  }

type PopoverContentImplInteralProps = PopoverContentImplProps & {
  context: PopoverContextValue
  setIsFullyHidden: React.Dispatch<React.SetStateAction<boolean>>
}

const PopoverContentImpl = React.forwardRef<
  PopoverContentImplElement,
  PopoverContentImplInteralProps
>(function PopoverContentImpl(props, forwardedRef) {
  const {
    trapFocus,
    scope,
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
    context,
    ...contentProps
  } = props

  const { open, keepChildrenMounted } = context

  const handleExitComplete = React.useCallback(() => {
    setIsFullyHidden?.(true)
  }, [setIsFullyHidden])

  let contents = (
    <ResetPresence disable={context.breakpointActive}>{children}</ResetPresence>
  )

  // i want to avoid reparenting but react-remove-scroll makes it hard
  // TODO its removed now so we can probable do it now
  if (!context.breakpointActive) {
    if (process.env.TAMAGUI_TARGET !== 'native') {
      contents = (
        <RemoveScroll
          enabled={context.breakpointActive ? false : enableRemoveScroll ? open : false}
        >
          <FocusScope
            loop={trapFocus !== false}
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
    <Animate
      type="presence"
      present={Boolean(open)}
      keepChildrenMounted={Boolean(keepChildrenMounted)}
      onExitComplete={handleExitComplete}
      lazyMount={lazyMount}
      passThrough={context.breakpointActive}
    >
      <PopperContent
        scope={scope}
        key={context.contentId}
        data-state={getState(open)}
        id={context.contentId}
        ref={forwardedRef}
        passThrough={context.breakpointActive}
        {...contentProps}
      >
        <PortalAdaptSafe context={context}>{contents}</PortalAdaptSafe>
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

export type PopoverCloseProps = ScopedPopoverProps<YStackProps>

export const PopoverClose = React.forwardRef<TamaguiElement, PopoverCloseProps>(
  function PopoverClose(props: ScopedPopoverProps<PopoverCloseProps>, forwardedRef) {
    const { scope, ...rest } = props
    const context = usePopoverContext(scope)
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
  }
)

/* -------------------------------------------------------------------------------------------------
 * PopoverArrow
 * -----------------------------------------------------------------------------------------------*/

export type PopoverArrowProps = PopperArrowProps

export const PopoverArrow = PopperArrowFrame.styleable<PopperArrowExtraProps>(
  function PopoverArrow(props, forwardedRef) {
    const { scope, ...rest } = props
    const context = usePopoverContext(scope)
    const isAdapted = useAdaptIsActive(context.adaptScope)

    if (isAdapted) {
      return null
    }

    return (
      <PopperArrow
        scope={scope}
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

export type PopoverScrollViewProps = ScrollViewProps & {
  scope?: string
}

const PopoverScrollView = React.forwardRef<ScrollView, PopoverScrollViewProps>(
  ({ scope, ...props }, ref) => {
    const context = usePopoverContext(scope)

    return (
      <ScrollView
        ref={ref}
        // when adapted, no pointer events!
        pointerEvents={context.breakpointActive ? 'none' : undefined}
        scrollEnabled={!context.breakpointActive}
        passThrough={context.breakpointActive}
        {...props}
      />
    )
  }
)

// only should be used here at root, the rest should get it from props
const DEFAULT_SCOPE = ''

export const Popover = withStaticProperties(
  React.forwardRef<Popover, PopoverProps>(function Popover(
    { scope = DEFAULT_SCOPE, ...props },
    ref
  ) {
    const id = React.useId()
    const adaptScope = `PopoverAdapt${scope}`

    return (
      <AdaptParent scope={adaptScope} portal>
        <PopoverInner
          adaptScope={adaptScope}
          ref={ref}
          id={id}
          scope={scope}
          {...props}
        />
      </AdaptParent>
    )
  }),
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
  PopoverProps & { id: string; adaptScope: string }
>(function PopoverInner(props, forwardedRef) {
  const {
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    scope = DEFAULT_SCOPE,
    keepChildrenMounted: keepChildrenMountedProp,
    hoverable,
    disableFocus,
    id,
    adaptScope,
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

  const isAdapted = useAdaptIsActive(adaptScope)

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
    popoverScope: scope,
    adaptScope,
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
  } satisfies PopoverContextValue

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
      <PopoverContext.Provider scope={scope} {...popoverContext}>
        <PopoverSheetController context={popoverContext} onOpenChange={setOpen}>
          {children}
        </PopoverSheetController>
      </PopoverContext.Provider>
    )
  }, [scope, setOpen, children, ...Object.values(popoverContext)])

  const contents = (
    <Popper open={open} passThrough={isAdapted} scope={scope} stayInFrame {...restProps}>
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
  context,
  ...props
}: {
  context: PopoverContextValue
  children: React.ReactNode
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>
}) => {
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
  const isAdapted = useAdaptIsActive(context.adaptScope)
  return context.open === false ? false : isAdapted
}
