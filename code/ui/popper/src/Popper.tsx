// adapted from radix-ui popper
import { useComposedRefs } from '@tamagui/compose-refs'
import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { SizeTokens, TamaguiElement, ViewProps } from '@tamagui/core'
import {
  LayoutMeasurementController,
  View as TamaguiView,
  createStyledContext,
  getVariableValue,
  styled,
  useProps,
} from '@tamagui/core'
import type {
  Coords,
  Middleware,
  OffsetOptions,
  Placement,
  Side,
  SizeOptions,
  Strategy,
  UseFloatingReturn,
} from '@tamagui/floating'
import {
  arrow,
  autoUpdate,
  flip,
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

export type PopperContextSlowValue = PopperContextShared &
  Pick<
    UseFloatingReturn,
    'context' | 'getReferenceProps' | 'getFloatingProps' | 'strategy' | 'update' | 'refs'
  >

export const PopperContextSlow = createStyledContext<PopperContextSlowValue>(
  // since we always provide this we can avoid setting here
  {} as PopperContextValue,
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
  const slowContext = getContextSlow(context)

  return (
    <PopperProviderFast scope={scope} {...context}>
      <PopperProviderSlow scope={scope} {...slowContext}>
        {children}
      </PopperProviderSlow>
    </PopperProviderFast>
  )
}

// avoid position based re-rendering
function getContextSlow(context: PopperContextValue): PopperContextSlowValue {
  return {
    refs: context.refs,
    size: context.size,
    arrowRef: context.arrowRef,
    arrowStyle: context.arrowStyle,
    onArrowSize: context.onArrowSize,
    hasFloating: context.hasFloating,
    strategy: context.strategy,
    update: context.update,
    context: context.context,
    getFloatingProps: context.getFloatingProps,
    getReferenceProps: context.getReferenceProps,
    open: context.open,
  }
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
  const isOpen = passThrough ? false : open || true

  let floating = useFloating({
    open: isOpen,
    strategy,
    placement,
    sameScrollView: false, // this only takes effect on native
    whileElementsMounted: !isOpen ? undefined : autoUpdate,
    platform:
      (disableRTL ?? setupOptions.disableRTL)
        ? {
            ...platform,
            isRTL(element) {
              return false
            },
          }
        : platform,
    middleware: [
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
    ].filter(Boolean),
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

  // memoize since we round x/y, floating-ui doesn't by default which can cause tons of updates
  // if the floating element is inside something animating with a spring
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
    floating.x,
    floating.y,
    floating.placement,
    JSON.stringify(middlewareData.arrow || null),
    JSON.stringify(middlewareData.transformOrigin || null),
    floating.isPositioned,
  ])

  return (
    <LayoutMeasurementController disable={!isOpen}>
      <PopperProvider scope={scope} {...popperContext}>
        {children}
      </PopperProvider>
    </LayoutMeasurementController>
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

    React.useEffect(() => {
      if (virtualRef) {
        refs.setReference(virtualRef.current)
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
          // this helps us with handling scoped poppers with many different targets
          // basically we wait for mouseEnter to ever set a reference and remove it on leave
          // otherwise floating ui gets confused by having >1 reference
          onMouseEnter: (e) => {
            if (ref.current instanceof HTMLElement) {
              refs.setReference(ref.current)

              if (!refProps) {
                return
              }

              refProps.onPointerEnter?.(e)
              update()
            }
          },
          onMouseLeave: (e) => {
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
    } = context

    // Wrap setFloating in startTransition to avoid React #185 (setState during render)
    // This can happen during rapid navigation when refs are set during render phase
    const safeSetFloating = React.useCallback(
      (node: any) => {
        startTransition(() => {
          refs.setFloating(node)
        })
      },
      [refs.setFloating]
    )

    const contentRefs = useComposedRefs<any>(safeSetFloating, forwardedRef)

    const [needsMeasure, setNeedsMeasure] = React.useState(animatePos)

    useIsomorphicLayoutEffect(() => {
      if (needsMeasure && x && y) {
        setNeedsMeasure(false)
      }
    }, [needsMeasure, animatePos, x, y])

    // default to not showing if positioned at 0, 0
    const hide = x === 0 && y === 0

    const disableAnimationProp =
      // if they want to animate also when re-positioning allow it
      animatePos === 'even-when-repositioning'
        ? needsMeasure
        : !isPositioned || needsMeasure

    const [disableAnimation, setDisableAnimation] = React.useState(disableAnimationProp)

    // we set this delayed because we need to pass to the animation driver the value and then update it
    React.useEffect(() => {
      setDisableAnimation(disableAnimationProp)
    }, [disableAnimationProp])

    // when position not calculated yet (hide=true means x===0 && y===0),
    // don't pass x/y to avoid motion driver capturing 0,0 as starting position
    // and then animating from 0,0 to the real position (causes visual jump)
    const positionProps = hide
      ? {} // omit x/y when hiding - prevents motion from animating from origin
      : { x: x || 0, y: y || 0 }

    const frameProps = {
      ref: contentRefs,
      ...positionProps,
      top: 0,
      left: 0,
      position: strategy,
      opacity: 1,
      ...(animatePos && {
        transition: rest.transition,
        animateOnly: disableAnimation ? [] : rest.animateOnly,
        // apply animation but disable it on initial render to avoid animating from 0 to the first position
        animatePresence: false,
      }),
      ...(hide && {
        opacity: 0,
        animateOnly: [],
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
      <TamaguiView
        passThrough={passThrough}
        ref={contentRefs}
        direction={(rest as any).direction}
        {...(passThrough ? null : floatingProps)}
        {...(!passThrough &&
          animatePos && {
            // marker for animation driver to know this is a popper element
            // that needs special handling for position animation interruption
            'data-popper-animate-position': 'true',
          })}
      >
        <PopperContentFrame
          key="popper-content-frame"
          passThrough={passThrough}
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
    const props = useProps(rest)
    const { offset, size: sizeProp, borderWidth = 0, ...arrowProps } = props

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
