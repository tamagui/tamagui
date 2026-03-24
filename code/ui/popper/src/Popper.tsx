// adapted from radix-ui popper
import { flushSync } from 'react-dom'
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { SizeTokens, TamaguiElement, ViewProps } from '@tamagui/core'
import {
  LayoutMeasurementController,
  View as TamaguiView,
  createStyledContext,
  getVariableValue,
  registerLayoutNode,
  styled,
} from '@tamagui/core'
import type { PopupTriggerMap } from '@tamagui/floating'
import { FloatingOverrideContext } from '@tamagui/floating'
import type {
  Coords,
  Middleware,
  OffsetOptions,
  Placement,
  ReferenceType,
  Side,
  SizeOptions,
  Strategy,
  UseFloatingReturn,
} from '@tamagui/floating'
import {
  arrow,
  flip,
  getOverflowAncestors,
  offset as offsetFn,
  platform,
  shift,
  size as sizeMiddleware,
  useFloating,
} from '@tamagui/floating'
import { getSpace } from '@tamagui/get-token'
import type { SizableStackProps, YStackProps } from '@tamagui/stacks'
import { YStack } from '@tamagui/stacks'
import { startTransition } from '@tamagui/start-transition'
import * as React from 'react'
import { Keyboard, useWindowDimensions } from 'react-native'

type ShiftProps = typeof shift extends (options: infer Opts) => void ? Opts : never
type FlipProps = typeof flip extends (options: infer Opts) => void ? Opts : never

/* -------------------------------------------------------------------------------------------------
 * Popper
 * -----------------------------------------------------------------------------------------------*/

export type PopperContextShared = {
  open: boolean
  size?: SizeTokens
  hasFloating: boolean
  arrowStyle?: Partial<Coords> & {
    centerOffset: number
  }
  placement?: Placement
  arrowRef: any
  onArrowSize?: (val: number) => void
  transformOrigin?: { x: string; y: string }
}

export type PopperContextValue = UseFloatingReturn & PopperContextShared

export const PopperContextFast = createStyledContext<PopperContextValue>(
  // since we always provide this we can avoid setting here
  {} as PopperContextValue,
  'Popper__'
)

export const PopperPositionContext = createStyledContext

export const { useStyledContext: usePopperContext, Provider: PopperProviderFast } =
  PopperContextFast

export type PopperContextSlowValue = Pick<
  UseFloatingReturn,
  'getReferenceProps' | 'update' | 'refs'
> & {
  onHoverReference?: (event: any) => void
  onLeaveReference?: () => void
  triggerElements?: PopupTriggerMap
}

export const PopperContextSlow = createStyledContext<PopperContextSlowValue>(
  // since we always provide this we can avoid setting here
  {} as PopperContextSlowValue,
  'PopperSlow__'
)

export const { useStyledContext: usePopperContextSlow, Provider: PopperProviderSlow } =
  PopperContextSlow

// handles both slow and fast:
export const PopperProvider = ({
  scope,
  children,
  ...context
}: PopperContextValue & { scope?: string; children?: React.ReactNode }) => {
  // single ref holds all unstable functions — updated every render so the
  // stable wrappers below always forward to the latest version
  const fns = React.useRef(context)
  fns.current = context

  // stable wrappers that never change identity — objectIdentityKey in
  // createStyledContext produces the same key across renders, so PopperAnchor
  // instances never re-render from context changes (only from parent re-renders)
  const [slowContext] = React.useState(
    (): PopperContextSlowValue => ({
      refs: context.refs,
      triggerElements: context.triggerElements,
      update(...a: []) {
        fns.current.update(...a)
      },
      getReferenceProps(p?: any) {
        return fns.current.getReferenceProps?.(p)
      },
      onHoverReference(e?: any) {
        ;(fns.current as any).onHoverReference?.(e)
      },
      onLeaveReference() {
        ;(fns.current as any).onLeaveReference?.()
      },
    })
  )

  return (
    <PopperProviderFast scope={scope} {...context}>
      <PopperProviderSlow scope={scope} {...slowContext}>
        {children}
      </PopperProviderSlow>
    </PopperProviderFast>
  )
}

export type PopperProps = {
  /**
   * Popper is a component used by other components to create interfaces, so scope is required
   * For example Popover uses it internally and sets a default "POPOVER_SCOPE".
   */
  scope?: string

  /**
   * Optional, will disable measuring updates when open is false for better performance
   * */
  open?: boolean

  size?: SizeTokens
  children?: React.ReactNode

  /**
   * Determine the preferred placement of the content in relation to the trigger
   */
  placement?: Placement

  /**
   * Shifts content horizontally to stay within viewport.
   * Pass an object to override shift options (mainAxis, crossAxis, padding, etc).
   * Defaults: { mainAxis: true, crossAxis: false, padding: 10 }
   * @see https://floating-ui.com/docs/shift
   */
  stayInFrame?: ShiftProps | boolean

  /**
   * Allows content to switch sides when space is limited.
   * @see https://floating-ui.com/docs/flip
   */
  allowFlip?: FlipProps | boolean

  /**
   * Resizes the content to fix inside the screen when space is limited
   * @see https://floating-ui.com/docs/size
   */
  resize?: boolean | Omit<SizeOptions, 'apply'>

  /**
   * Choose between absolute or fixed positioning
   */
  strategy?: Strategy

  /**
   * Move the content away from the trigger
   * @see https://floating-ui.com/docs/offset
   */
  offset?: OffsetOptions

  disableRTL?: boolean

  passThrough?: boolean
}

const checkFloating =
  process.env.TAMAGUI_TARGET === 'native'
    ? {
        name: 'checkFloating',
        fn(data: any) {
          return {
            data: {
              hasFloating: !!data.rects.floating.width,
            },
          }
        },
      }
    : undefined

export type PopperSetupOptions = {
  disableRTL?: boolean
}

const setupOptions: PopperSetupOptions = {}

export function setupPopper(options?: PopperSetupOptions) {
  Object.assign(setupOptions, options)
}

// forked from radix-ui 👇
// https://github.com/radix-ui/primitives/blob/1910a8c91c5927e58b8fca3aeaa31411f32fee7c/packages/react/popper/src/Popper.tsx#L359-L399
function getSideAndAlignFromPlacement(placement: Placement) {
  const [side, align = 'center'] = placement.split('-')
  return [side as Side, align as 'center' | 'start' | 'end'] as const
}

const transformOriginMiddleware = (options: {
  arrowWidth: number
  arrowHeight: number
}): Middleware => ({
  name: 'transformOrigin',
  options,
  fn(data) {
    const { placement, rects, middlewareData } = data

    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0
    const isArrowHidden = cannotCenterArrow
    const arrowWidth = isArrowHidden ? 0 : options.arrowWidth
    const arrowHeight = isArrowHidden ? 0 : options.arrowHeight

    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement)
    const noArrowAlign = { start: '0%', center: '50%', end: '100%' }[placedAlign]

    const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2
    const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2

    let x = ''
    let y = ''

    if (placedSide === 'bottom') {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`
      y = `${-arrowHeight}px`
    } else if (placedSide === 'top') {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`
      y = `${rects.floating.height + arrowHeight}px`
    } else if (placedSide === 'right') {
      x = `${-arrowHeight}px`
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`
    } else if (placedSide === 'left') {
      x = `${rects.floating.width + arrowHeight}px`
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`
    }

    return { data: { x, y } }
  },
})

// replaces floating-ui's autoUpdate with tamagui's batched IO measurement loop
// keeps scroll/resize listeners for immediate response, but replaces per-element
// ResizeObserver + IntersectionObserver with the shared layoutOnAnimationFrame loop
function tamaguiAutoUpdate(
  reference: ReferenceType,
  floating: HTMLElement,
  update: () => void
): () => void {
  // initial position
  update()

  // schedule a second update after layout/scroll events settle (e.g. focus-
  // triggered scrolls that cause flip corrections)
  let rafId = requestAnimationFrame(() => {
    update()
    rafId = 0
  })

  const cleanups: (() => void)[] = [
    () => {
      if (rafId) cancelAnimationFrame(rafId)
    },
  ]

  // watch reference element via tamagui's IO measurement loop
  // only watch reference, NOT floating — watching floating causes loops
  // (computePosition sets position → rect changes → update → repeat)
  if (reference instanceof HTMLElement) {
    cleanups.push(registerLayoutNode(reference, update))
  }

  // scroll listeners for immediate response (only for real DOM elements)
  const refAncestors = reference instanceof Element ? getOverflowAncestors(reference) : []
  const ancestors = [...refAncestors, ...getOverflowAncestors(floating)]
  const uniqueAncestors = [...new Set(ancestors)]
  for (const ancestor of uniqueAncestors) {
    ancestor.addEventListener('scroll', update, { passive: true })
  }

  // window resize
  window.addEventListener('resize', update)

  cleanups.push(() => {
    for (const ancestor of uniqueAncestors) {
      ancestor.removeEventListener('scroll', update)
    }
    window.removeEventListener('resize', update)
  })

  return () => cleanups.forEach((fn) => fn())
}

export function Popper(props: PopperProps) {
  const {
    children,
    size,
    strategy = 'absolute',
    placement = 'bottom',
    stayInFrame,
    allowFlip,
    offset,
    disableRTL,
    resize,
    passThrough,
    open,
    scope,
  } = props

  const [arrowEl, setArrow] = React.useState<any>(null)
  const [arrowSize, setArrowSize] = React.useState(0)
  const offsetOptions = offset ?? arrowSize
  const floatingStyle = React.useRef({})
  const isOpen = passThrough ? false : (open ?? true)

  // freeze middleware reference when closed so floating-ui's deepEqual trivially
  // passes (same object) and skips computePosition on re-renders while closed.
  // unlike swapping to [], this retains the last good middleware so cached
  // position data (offset, arrow, transformOrigin) stays correct for reopen.
  const middlewareRef = React.useRef<any[]>([])
  if (isOpen) {
    middlewareRef.current = [
      // order matters: offset first, then flip, then shift, then arrow
      typeof offsetOptions !== 'undefined' ? offsetFn(offsetOptions) : (null as any),
      allowFlip ? flip(typeof allowFlip === 'boolean' ? {} : allowFlip) : (null as any),
      // NOTE: shift's axis terminology is reversed vs flip/offset:
      // for top/bottom placements: mainAxis = horizontal, crossAxis = vertical
      // for left/right placements: mainAxis = vertical, crossAxis = horizontal
      // default to horizontal shift only (mainAxis: true, crossAxis: false)
      stayInFrame
        ? shift({
            padding: 10,
            mainAxis: true,
            crossAxis: false,
            ...(typeof stayInFrame === 'object' ? stayInFrame : null),
          })
        : (null as any),
      arrowEl ? arrow({ element: arrowEl }) : (null as any),
      checkFloating,
      process.env.TAMAGUI_TARGET !== 'native' && resize
        ? sizeMiddleware({
            padding: typeof stayInFrame === 'object' ? stayInFrame.padding : 10,
            apply({ availableHeight, availableWidth }) {
              if (passThrough) {
                return
              }

              Object.assign(floatingStyle.current, {
                maxHeight: `${availableHeight}px`,
                maxWidth: `${availableWidth}px`,
              })
              // we wrap PopperContent with one container stack so we need to account for it
              const floatingChild = floating.refs.floating.current?.firstChild
              if (floatingChild && floatingChild instanceof HTMLElement) {
                Object.assign(floatingChild.style, floatingStyle.current)
              }
            },
            ...(typeof resize === 'object' && resize),
          })
        : (null as any),
      // Add size middleware for CSS custom properties (web only)
      process.env.TAMAGUI_TARGET !== 'native'
        ? sizeMiddleware({
            apply({ elements, rects, availableWidth, availableHeight }) {
              const { width: anchorWidth, height: anchorHeight } = rects.reference
              const contentStyle = elements.floating.style
              contentStyle.setProperty(
                '--tamagui-popper-available-width',
                `${availableWidth}px`
              )
              contentStyle.setProperty(
                '--tamagui-popper-available-height',
                `${availableHeight}px`
              )
              contentStyle.setProperty(
                '--tamagui-popper-anchor-width',
                `${anchorWidth}px`
              )
              contentStyle.setProperty(
                '--tamagui-popper-anchor-height',
                `${anchorHeight}px`
              )
            },
          })
        : (null as any),
      // Transform origin middleware (web only)
      process.env.TAMAGUI_TARGET !== 'native'
        ? transformOriginMiddleware({
            arrowHeight: arrowSize,
            arrowWidth: arrowSize,
          })
        : (null as any),
    ].filter(Boolean)
  }

  let floating = useFloating({
    open: isOpen,
    strategy,
    placement,
    sameScrollView: false, // this only takes effect on native
    whileElementsMounted: !isOpen ? undefined : tamaguiAutoUpdate,
    platform:
      (disableRTL ?? setupOptions.disableRTL)
        ? {
            ...platform,
            isRTL(element) {
              return false
            },
          }
        : platform,
    middleware: middlewareRef.current,
  })

  if (process.env.TAMAGUI_TARGET !== 'native') {
    // add our size middleware here
    floating = React.useMemo(() => {
      const og = floating.getFloatingProps
      if (resize && og) {
        floating.getFloatingProps = (props) => {
          return og({
            ...props,
            style: {
              ...props.style,
              ...floatingStyle.current,
            },
          })
        }
      }
      return floating
    }, [floating, resize ? JSON.stringify(resize) : null])
  }

  const { middlewareData } = floating

  if (process.env.TAMAGUI_TARGET === 'native') {
    // On Native there's no autoupdate so we call update() when necessary

    // Subscribe to window dimensions (orientation, scale, etc...)
    const dimensions = useWindowDimensions()

    // Subscribe to keyboard state
    const [keyboardOpen, setKeyboardOpen] = React.useState(false)
    React.useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        startTransition(() => {
          setKeyboardOpen(true)
        })
      })
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        startTransition(() => {
          setKeyboardOpen(false)
        })
      })

      return () => {
        showSubscription.remove()
        hideSubscription.remove()
      }
    }, [])

    useIsomorphicLayoutEffect(() => {
      if (passThrough) return
      floating.update()
    }, [passThrough, dimensions, keyboardOpen])
  }

  const popperContext = React.useMemo(() => {
    return {
      size,
      arrowRef: setArrow,
      arrowStyle: middlewareData.arrow,
      onArrowSize: setArrowSize,
      hasFloating: middlewareData.checkFloating?.hasFloating,
      transformOrigin: middlewareData.transformOrigin as
        | { x: string; y: string }
        | undefined,
      open: !!open,
      ...floating,
    } satisfies PopperContextValue
  }, [
    open,
    size,
    floating,
    JSON.stringify(middlewareData.arrow || null),
    JSON.stringify(middlewareData.transformOrigin || null),
  ])

  return (
    <PopperProvider scope={scope} {...popperContext}>
      {/* reset FloatingOverrideContext so it doesn't leak into nested Poppers —
          each Popper consumes the override for its own useFloating, children
          should not inherit it (e.g. a Menu inside a Tooltip's tree) */}
      <FloatingOverrideContext.Provider value={null}>
        {children}
      </FloatingOverrideContext.Provider>
    </PopperProvider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * PopperAnchor
 * -----------------------------------------------------------------------------------------------*/

type PopperAnchorRef = TamaguiElement

export type PopperAnchorExtraProps = {
  virtualRef?: React.RefObject<any>
  scope?: string
}
export type PopperAnchorProps = YStackProps

export const PopperAnchor = YStack.styleable<PopperAnchorExtraProps>(
  function PopperAnchor(props, forwardedRef) {
    const { virtualRef, scope, ...rest } = props
    const context = usePopperContextSlow(scope)
    const { getReferenceProps, refs, update } = context
    const ref = React.useRef<PopperAnchorRef>(null)
    const triggerId = React.useId()

    // register this trigger element with the shared trigger map
    // so useHover can detect cursor moves between sibling triggers
    React.useEffect(() => {
      if (!scope || !context.triggerElements || !ref.current) return
      if (!(ref.current instanceof Element)) return
      const el = ref.current as Element
      context.triggerElements.add(triggerId, el)
      return () => {
        context.triggerElements?.delete(triggerId)
      }
    }, [scope, triggerId, context.triggerElements])

    React.useEffect(() => {
      if (virtualRef) {
        refs.setReference(virtualRef.current)
        // recompute position after setting virtual reference
        update()
      }
    }, [virtualRef])

    const refProps =
      getReferenceProps?.({
        ...rest,
        ref,
      }) || null

    // Wrap setReference in startTransition to avoid React #185 (setState during render)
    const safeSetReference = React.useCallback(
      (node: any) => {
        startTransition(() => {
          refs.setReference(node)
        })
      },
      // it was refs.setRefernce but its stable and refs is undefined on server
      [refs]
    )

    const shouldHandleInHover = isWeb && scope
    const composedRefs = useComposedRefs(
      forwardedRef,
      ref,
      // web handles this onMouseEnter below so it can support multiple targets + hovering
      shouldHandleInHover ? undefined : safeSetReference
    )

    return (
      <TamaguiView
        {...rest}
        {...refProps}
        ref={composedRefs}
        {...(shouldHandleInHover && {
          // scoped poppers with multiple triggers: set the reference on
          // mouseEnter so floating-ui positions relative to the hovered
          // trigger, not the last one rendered.
          //
          // flushSync is critical here: without it, setReference batches
          // with React's async state updates and the arrow/content position
          // computes against the OLD reference element. this causes the
          // arrow to flash at x=0 (top-left) during trigger switches.
          // flushSync forces synchronous commit so update() below reads
          // the correct reference element immediately.
          onMouseEnter: (e) => {
            const el = (e.currentTarget ?? ref.current) as HTMLElement | null
            if (el instanceof HTMLElement) {
              flushSync(() => refs.setReference(el))
              update()

              if (!refProps) return

              refProps.onPointerEnter?.(e)
              context.onHoverReference?.(e.nativeEvent)
            }
          },
          onMouseLeave: (e) => {
            context.onLeaveReference?.()
            refProps?.onMouseLeave?.(e)
          },
        })}
      />
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * PopperContent
 * -----------------------------------------------------------------------------------------------*/

type PopperContentElement = TamaguiElement

export type PopperContentProps = SizableStackProps & {
  scope?: string
  /**
   * Enable smooth animation when the content position changes (e.g., when flipping sides)
   */
  animatePosition?: boolean | 'even-when-repositioning'
  /** @deprecated Use `animatePosition` instead */
  enableAnimationForPositionChange?: boolean | 'even-when-repositioning'
  passThrough?: boolean
}

export const PopperContentFrame = styled(YStack, {
  name: 'PopperContent',

  variants: {
    unstyled: {
      true: {},
    },

    size: {
      '...size': (val, { tokens }) => {
        return {
          padding: tokens.space[val],
          borderRadius: tokens.radius[val],
        }
      },
    },
  } as const,
})

export const PopperContent = React.forwardRef<PopperContentElement, PopperContentProps>(
  function PopperContent(props, forwardedRef) {
    const {
      scope,
      animatePosition,
      enableAnimationForPositionChange,
      children,
      passThrough,
      unstyled,
      ...rest
    } = props
    const animatePos = animatePosition ?? enableAnimationForPositionChange
    const context = usePopperContext(scope)

    const {
      strategy,
      placement,
      refs,
      x,
      y,
      getFloatingProps,
      size,
      isPositioned,
      transformOrigin,
      update,
    } = context

    // keep update() accessible inside safeSetFloating without adding it as a dep
    const updateRef = React.useRef(update)
    updateRef.current = update

    // ref callback: call refs.setFloating directly (no startTransition) so floating-ui's
    // state update runs synchronously and position is computed on mount.
    // note: ref callbacks fire during the commit phase, not render, so calling setState
    // here is safe - React batches it for the next commit.
    //
    // when animatePosition=true, disableAnimation state changes cycle the DOM node
    // (null then re-mount). we block all null calls here to prevent floating-ui from
    // losing its reference mid-cycle; genuine unmount is handled by the useEffect below.
    // for same-node cycling (animateOnly prop change without remount), refs.setFloating
    // is a no-op in floating-ui (same-node guard), so we call update() to force recompute.
    const lastNodeRef = React.useRef<any>(null)
    const safeSetFloating = React.useCallback(
      (node: any) => {
        const isNewNode = node !== lastNodeRef.current
        if (node) {
          lastNodeRef.current = node
          refs.setFloating(node)
          if (!isNewNode) {
            // same node re-appeared (prop cycling without remount):
            // refs.setFloating is a no-op, so force position recompute
            updateRef.current?.()
          }
        }
        // null calls are blocked: cycling nulls are transient, genuine unmount
        // is handled by the useEffect cleanup below
      },
      [refs.setFloating]
    )

    // clear floating-ui's reference when the component genuinely unmounts.
    // IMPORTANT: useEffect cleanup is deferred — when PopperContent remounts
    // (e.g. animation prop cycling), the new instance's ref callback fires
    // BEFORE this cleanup runs. without the guard, we'd null out the ref that
    // the new instance just set, causing all subsequent update() calls to
    // early-return (the "stuck tooltip" bug).
    React.useEffect(() => {
      return () => {
        const ourNode = lastNodeRef.current
        // only clear if floating-ui still points to OUR node — if a new
        // instance already set a different node, don't touch it
        if (ourNode && refs.floating.current === ourNode) {
          refs.setFloating(null)
        }
        lastNodeRef.current = null
      }
    }, [])

    const contentRefs = useComposedRefs<any>(safeSetFloating, forwardedRef)

    const [needsMeasure, setNeedsMeasure] = React.useState(animatePos)

    useIsomorphicLayoutEffect(() => {
      if (needsMeasure && x && y) {
        setNeedsMeasure(false)
      }
    }, [needsMeasure, animatePos, x, y])

    // track whether we've ever been positioned. floating-ui resets isPositioned
    // to false when open changes to false (e.g. hoverable safePolygon briefly
    // closing). without this, the brief close disables animation and causes
    // position jumps when the popover reopens at the new trigger.
    const hasBeenPositioned = React.useRef(false)
    const lastGoodPosition = React.useRef({ x: 0, y: 0 })
    if (x !== 0 || y !== 0) {
      // always track the latest computed position so that when a new reference
      // is set while closed (e.g. content → gap → different trigger), the
      // effectiveX/Y fallback uses the fresh position, not the stale one
      lastGoodPosition.current = { x, y }
      if (isPositioned) {
        hasBeenPositioned.current = true
      }
    }

    // use the last known good position when floating-ui provides 0,0.
    // this happens in two cases:
    // 1. close/reopen cycle: isPositioned resets to false
    // 2. trigger switch: reference element changes, floating-ui briefly
    //    provides x=0,y=0 while isPositioned is still true, causing the
    //    animation driver to animate toward (0,0) for 2-3 frames
    const brieflyZero = hasBeenPositioned.current && x === 0 && y === 0
    const effectiveX = brieflyZero ? lastGoodPosition.current.x : x
    const effectiveY = brieflyZero ? lastGoodPosition.current.y : y

    // only hide before the very first positioning
    const hide = !hasBeenPositioned.current && effectiveX === 0 && effectiveY === 0

    const disableAnimationProp =
      // if they want to animate also when re-positioning allow it
      animatePos === 'even-when-repositioning'
        ? needsMeasure
        : (!hasBeenPositioned.current && !isPositioned) || needsMeasure

    const [disableAnimation, setDisableAnimation] = React.useState(disableAnimationProp)

    // set in an effect so we apply the css transition only after the element is positioned,
    // not on the first render (which would animate from y=0 to the actual position)
    React.useEffect(() => {
      setDisableAnimation(disableAnimationProp)
    }, [disableAnimationProp])

    const positionProps = hide
      ? {} // omit x/y when hiding - prevents motion driver from animating from origin
      : { x: effectiveX || 0, y: effectiveY || 0 }

    const frameProps = {
      ref: contentRefs,
      ...positionProps,
      top: 0,
      left: 0,
      position: strategy,
      opacity: hide ? 0 : 1,
      ...(animatePos && {
        transition: rest.transition,
        // animateOnly: [] turns off transitions while keeping styles applied,
        // letting the element move to its position silently before animations start
        animateOnly: disableAnimation ? [] : rest.animateOnly,
        animatePresence: false,
      }),
    }

    // outer frame because we explicitly don't want animation to apply to this

    const { style, ...floatingProps } = getFloatingProps
      ? getFloatingProps(frameProps)
      : frameProps

    // Compute the CSS transform-origin value from middleware data
    const transformOriginStyle =
      isWeb && transformOrigin
        ? { transformOrigin: `${transformOrigin.x} ${transformOrigin.y}` }
        : undefined

    return (
      <LayoutMeasurementController disable={!context.open}>
        <TamaguiView
          passThrough={passThrough}
          ref={contentRefs}
          direction={rest.direction}
          {...(passThrough ? null : floatingProps)}
          {...(!passThrough &&
            animatePos && {
              'data-popper-animate-position': 'true',
            })}
        >
          <PopperContentFrame
            key="popper-content-frame"
            passThrough={passThrough}
            unstyled={unstyled}
            {...(!passThrough && {
              'data-placement': placement,
              'data-strategy': strategy,
              size,
              ...style,
              ...transformOriginStyle,
              ...rest,
            })}
          >
            {children}
          </PopperContentFrame>
        </TamaguiView>
      </LayoutMeasurementController>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * PopperArrow
 * -----------------------------------------------------------------------------------------------*/

export type PopperArrowExtraProps = {
  offset?: number
  size?: SizeTokens
  scope?: string
  /**
   * Enable smooth animation when the arrow position changes
   */
  animatePosition?: boolean
}

export type PopperArrowProps = YStackProps & PopperArrowExtraProps

export const PopperArrowFrame = styled(YStack, {
  name: 'PopperArrow',

  variants: {
    unstyled: {
      false: {
        borderColor: '$borderColor',
        backgroundColor: '$background',
        position: 'relative',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const PopperArrowOuterFrame = styled(YStack, {
  name: 'PopperArrowOuter',

  variants: {
    unstyled: {
      false: {
        position: 'absolute',
        zIndex: 1_000_000,
        pointerEvents: 'none',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1',
  },
})

const opposites = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
} as const

type Sides = keyof typeof opposites

export const PopperArrow = React.forwardRef<TamaguiElement, PopperArrowProps>(
  function PopperArrow(propsIn, forwardedRef) {
    const { scope, animatePosition, transition, ...rest } = propsIn
    const { offset, size: sizeProp, borderWidth = 0, ...arrowProps } = rest

    const context = usePopperContext(scope)

    // TODO: get rid! at the very least move up to Popover and simplify
    const sizeVal =
      typeof sizeProp === 'number'
        ? sizeProp
        : getVariableValue(
            getSpace(sizeProp ?? context.size, {
              shift: -2,
              bounds: [2],
            })
          )

    const size = Math.max(0, +sizeVal)

    const { placement } = context
    const refs = useComposedRefs(context.arrowRef, forwardedRef)

    // Sometimes floating-ui can return NaN during orientation or screen size changes on native
    // so we explicitly force the x,y position types as a number
    const x = (context.arrowStyle?.x as number) || 0
    const y = (context.arrowStyle?.y as number) || 0

    // hide arrow until floating-ui has computed its position to prevent
    // flash at x=0 during initial render or trigger switches in hydration
    const arrowPositioned = context.arrowStyle != null

    const primaryPlacement = (placement ? placement.split('-')[0] : 'top') as Sides

    const arrowStyle: ViewProps = { x, y, width: size, height: size }

    const innerArrowStyle: ViewProps = {}
    const isVertical = primaryPlacement === 'bottom' || primaryPlacement === 'top'

    if (primaryPlacement) {
      // allows for extra diagonal size
      arrowStyle[isVertical ? 'width' : 'height'] = size * 2
      const oppSide = opposites[primaryPlacement]
      if (oppSide) {
        arrowStyle[oppSide] = -size
        innerArrowStyle[oppSide] = size / 2
      }
      if (oppSide === 'top' || oppSide === 'bottom') {
        arrowStyle.left = 0
      }
      if (oppSide === 'left' || oppSide === 'right') {
        arrowStyle.top = 0
      }

      // send the Arrow's offset up to Popper
      useIsomorphicLayoutEffect(() => {
        context.onArrowSize?.(size)
      }, [size, context.onArrowSize])
    }

    // outer frame to cut off for ability to have nicer shadows/borders
    return (
      <PopperArrowOuterFrame
        ref={refs}
        {...arrowStyle}
        {...(!arrowPositioned && { opacity: 0 })}
        {...(animatePosition && {
          transition,
          animateOnly: ['transform'],
          animatePresence: false,
        })}
      >
        <PopperArrowFrame
          width={size}
          height={size}
          {...arrowProps}
          {...innerArrowStyle}
          rotate="45deg"
          {...(primaryPlacement === 'bottom' && {
            borderLeftWidth: borderWidth,
            borderTopWidth: borderWidth,
          })}
          {...(primaryPlacement === 'top' && {
            borderBottomWidth: borderWidth,
            borderRightWidth: borderWidth,
          })}
          {...(primaryPlacement === 'right' && {
            borderLeftWidth: borderWidth,
            borderBottomWidth: borderWidth,
          })}
          {...(primaryPlacement === 'left' && {
            borderTopWidth: borderWidth,
            borderRightWidth: borderWidth,
          })}
        />
      </PopperArrowOuterFrame>
    )
  }
)

/* -----------------------------------------------------------------------------------------------*/
