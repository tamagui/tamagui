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
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { SizeTokens, TamaguiElement, ViewProps } from '@tamagui/core'
import {
  createStyledContext,
  styled,
  Theme,
  useCreateShallowSetState,
  useEvent,
  useGet,
  useThemeName,
  View,
} from '@tamagui/core'
import {
  Dismissable,
  DismissableBranch,
  type DismissableProps,
} from '@tamagui/dismissable'
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
import { needsPortalRepropagation, Portal, resolveViewZIndex } from '@tamagui/portal'
import { RemoveScroll } from '@tamagui/remove-scroll'
import { ScrollView, type ScrollViewProps } from '@tamagui/scroll-view'
import { SheetController } from '@tamagui/sheet/controller'
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

const needsRepropagation = needsPortalRepropagation()

const openPopovers = new Set<React.Dispatch<React.SetStateAction<boolean>>>()

export const hasOpenPopovers = () => {
  return openPopovers.size > 0
}

export const closeOpenPopovers = () => {
  if (openPopovers.size === 0) return false
  openPopovers.forEach((setOpen) => setOpen(false))
  return true
}

export const closeLastOpenedPopover = () => {
  if (openPopovers.size === 0) return false
  const last = Array.from(openPopovers).pop()
  if (last) {
    last(false)
    return true
  }
  return false
}

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

  /**
   * Disable the dismissable layer (escape key, outside click handling).
   * Useful for popovers that stay mounted but are visually hidden.
   */
  disableDismissable?: boolean
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
  disableDismissable?: boolean
  anchorTo?: Rect
  // scoped branches Set for DismissableBranch/Dismissable to share
  branches: Set<HTMLElement>
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

export type PopoverTriggerProps = ScopedPopoverProps<ViewProps>

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
    }, [context.anchorTo, anchorTo?.x, anchorTo?.y, anchorTo?.height, anchorTo?.width])

    // wrap trigger in DismissableBranch so clicking it doesn't fire pointerDownOutside
    // which would close the popover before onPress can toggle it
    const wrappedTrigger = isWeb ? (
      <DismissableBranch branches={context.branches}>{trigger}</DismissableBranch>
    ) : (
      trigger
    )

    return context.hasCustomAnchor ? (
      wrappedTrigger
    ) : (
      <PopperAnchor {...(virtualRef && { virtualRef })} scope={scope} asChild>
        {wrappedTrigger}
      </PopperAnchor>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * PopoverContent
 * -----------------------------------------------------------------------------------------------*/

export interface PopoverContentTypeProps extends Omit<
  PopoverContentImplProps,
  'disableOutsidePointerEvents'
> {
  /**
   * Enable smooth animation when the content position changes (e.g., when flipping sides)
   */
  animatePosition?: boolean | 'even-when-repositioning'
  /** @deprecated Use `animatePosition` instead */
  enableAnimationForPositionChange?: boolean
}

export type PopoverContentProps = PopoverContentTypeProps

export const PopoverContent = PopperContentFrame.styleable<PopoverContentProps>(
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

    // Reset isFullyHidden when popover opens (useEffect avoids render-phase timing issues)
    // there was a hard to isolate bug in tamagui.dev where moving between /ui docs pages quickly
    // caused it to infinite loop, the setState in render (and useLayoutEffect) made it too prone
    // to bug, useEffect maybe fine here because its hidden, ok to be slightly delayed while hidden
    useIsomorphicLayoutEffect(() => {
      if (context.open && isFullyHidden) {
        setIsFullyHidden(false)
      }
    }, [context.open, isFullyHidden])

    if (!context.keepChildrenMounted) {
      if (isFullyHidden && !context.open) {
        return null
      }
    }

    return (
      <PopoverPortal
        passThrough={context.breakpointActive}
        context={context}
        zIndex={zIndex}
      >
        <View
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
        </View>
      </PopoverPortal>
    )
  }
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
  'use no memo'

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
  'use no memo'

  let content = children

  // native without teleport
  if (needsRepropagation) {
    const parentContexts = useParentContexts(context.popoverScope)
    content = (
      <RepropagateParentContexts {...parentContexts}>{content}</RepropagateParentContexts>
    )
  }

  return (
    <Portal passThrough={passThrough} stackZIndex zIndex={zIndex}>
      {/* forceClassName avoids forced re-mount renders for some reason... see the HeadMenu as you change tints a few times */}
      {/* without this you'll see the site menu re-rendering. It must be something in wrapping children in Theme */}
      {!!context.open && !context.breakpointActive && (
        <YStack
          fullscreen
          onPress={composeEventHandlers(onPress as any, context.onOpenToggle)}
        />
      )}

      {/* i removed a hardcoded StackZIndex because Portal has it internally now with useStackedZIndex + ZIndexHardcoded */}
      {content}
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

    /**
     * Performance - if never going to use feature can permanently disable
     */
    alwaysDisable?: {
      focus?: boolean
      'remove-scroll'?: boolean
      dismiss?: boolean
    }
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
    forceUnmount,
    context,
    alwaysDisable,
    ...contentProps
  } = props

  const { open, keepChildrenMounted, disableDismissable } = context

  const handleExitComplete = React.useCallback(() => {
    setIsFullyHidden?.(true)
  }, [setIsFullyHidden])

  let contents = (
    <ResetPresence disable={context.breakpointActive}>{children}</ResetPresence>
  )

  const handleDismiss = React.useCallback(() => {
    context.onOpenChange(false, 'press')
  }, [context])

  // i want to avoid reparenting but react-remove-scroll makes it hard
  // TODO its removed now so we can probable do it now
  if (!context.breakpointActive) {
    if (process.env.TAMAGUI_TARGET !== 'native') {
      if (!alwaysDisable || !alwaysDisable.focus) {
        contents = (
          <FocusScope
            loop={trapFocus !== false}
            enabled={context.breakpointActive ? false : disableFocusScope ? false : open}
            trapped={context.breakpointActive ? false : trapFocus}
            onMountAutoFocus={onOpenAutoFocus}
            onUnmountAutoFocus={onCloseAutoFocus === false ? undefined : onCloseAutoFocus}
          >
            <div style={dspContentsStyle}>{contents}</div>
          </FocusScope>
        )
      }

      if (!alwaysDisable || !alwaysDisable['remove-scroll']) {
        contents = (
          <RemoveScroll
            enabled={context.breakpointActive ? false : enableRemoveScroll ? open : false}
          >
            {contents}
          </RemoveScroll>
        )
      }

      if (!alwaysDisable || !alwaysDisable.dismiss) {
        contents = (
          <Dismissable
            branches={context.branches}
            forceUnmount={disableDismissable || (forceUnmount ?? !open)}
            onEscapeKeyDown={onEscapeKeyDown}
            onPointerDownOutside={onPointerDownOutside}
            onFocusOutside={onFocusOutside}
            onInteractOutside={onInteractOutside}
            onDismiss={handleDismiss}
          >
            {contents}
          </Dismissable>
        )
      }
    }
  }

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
        {...(!contentProps.unstyled && {
          size: '$true',
          backgroundColor: '$background',
          alignItems: 'center',
        })}
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
    disableDismissable,
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

  // track open popovers for closeOpenPopovers()
  React.useEffect(() => {
    if (!open) return
    openPopovers.add(setOpen)
    return () => {
      openPopovers.delete(setOpen)
    }
  }, [open, setOpen])

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

  // scoped branches Set for DismissableBranch/Dismissable to share
  const [branches] = React.useState(() => new Set<HTMLElement>())

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
    disableDismissable,
    branches,
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
