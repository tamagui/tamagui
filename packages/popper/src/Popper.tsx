// adapted from radix-ui popper

import { useComposedRefs } from '@tamagui/compose-refs'
import { isAndroid, isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import type { ScopedProps, SizeTokens, StackProps } from '@tamagui/core'
import { debounce } from '@tamagui/use-debounce'
import {
  Stack,
  View as TamaguiView,
  createStyledContext,
  getVariableValue,
  styled,
  useDidFinishSSR,
  useProps,
} from '@tamagui/core'
import type {
  Coords,
  OffsetOptions,
  Placement,
  Strategy,
  UseFloatingReturn,
} from '@tamagui/floating'
import {
  arrow,
  autoUpdate,
  flip,
  offset as offsetFn,
  shift,
  useFloating,
} from '@tamagui/floating'
import { getSpace } from '@tamagui/get-token'
import type { SizableStackProps, YStackProps } from '@tamagui/stacks'
import { ThemeableStack, YStack } from '@tamagui/stacks'
import * as React from 'react'
import type { View } from 'react-native'
import { Keyboard, useWindowDimensions } from 'react-native'

type ShiftProps = typeof shift extends (options: infer Opts) => void ? Opts : never
type FlipProps = typeof flip extends (options: infer Opts) => void ? Opts : never

/* -------------------------------------------------------------------------------------------------
 * Popper
 * -----------------------------------------------------------------------------------------------*/

export type PopperContextValue = UseFloatingReturn & {
  isMounted: boolean
  size?: SizeTokens
  placement?: Placement
  arrowRef: any
  onArrowSize?: (val: number) => void
  hasFloating: boolean
  arrowStyle?: Partial<Coords> & {
    centerOffset: number
  }
}

export const PopperContext = createStyledContext<PopperContextValue>({} as any)

export const { useStyledContext: usePopperContext, Provider: PopperProvider } =
  PopperContext

export type PopperProps = {
  size?: SizeTokens
  children?: React.ReactNode
  placement?: Placement
  stayInFrame?: ShiftProps | boolean
  allowFlip?: FlipProps | boolean
  strategy?: Strategy
  offset?: OffsetOptions
}

type ScopedPopperProps<P> = ScopedProps<P, 'Popper'>

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

export function Popper(props: ScopedPopperProps<PopperProps>) {
  const {
    children,
    size,
    strategy = 'absolute',
    placement = 'bottom',
    stayInFrame,
    allowFlip,
    offset,
    __scopePopper,
  } = props

  const isMounted = useDidFinishSSR()
  const [arrowEl, setArrow] = React.useState<any>(null)
  const [arrowSize, setArrowSize] = React.useState(0)
  const offsetOptions = offset ?? arrowSize

  const floating = useFloating({
    strategy,
    placement,
    sameScrollView: false, // this only takes effect on native
    middleware: [
      stayInFrame
        ? shift(typeof stayInFrame === 'boolean' ? {} : stayInFrame)
        : (null as any),
      allowFlip ? flip(typeof allowFlip === 'boolean' ? {} : allowFlip) : (null as any),
      arrowEl ? arrow({ element: arrowEl }) : (null as any),
      typeof offsetOptions !== 'undefined' ? offsetFn(offsetOptions) : (null as any),
      checkFloating,
    ].filter(Boolean),
  })

  const {
    refs,
    middlewareData,
    // @ts-expect-error this comes from Tooltip for example
    open,
    floatingStyles,
  } = floating

  if (isWeb) {
    useIsomorphicLayoutEffect(() => {
      if (!open) return
      if (!(refs.reference.current && refs.floating.current)) {
        return
      }
      // Only call this when the floating element is rendered
      return autoUpdate(refs.reference.current, refs.floating.current, floating.update)
    }, [open, floating.update, refs.floating, refs.reference])
  } else {
    // On Native there's no autoupdate so we call update() when necessary

    // Subscribe to window dimensions (orientation, scale, etc...)
    const dimensions = useWindowDimensions()

    // Subscribe to keyboard state
    const [keyboardOpen, setKeyboardOpen] = React.useState(false)
    React.useEffect(() => {
      const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
        setKeyboardOpen(true)
      })
      const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardOpen(false)
      })

      return () => {
        showSubscription.remove()
        hideSubscription.remove()
      }
    }, [])

    useIsomorphicLayoutEffect(() => {
      floating.update()
    }, [dimensions, keyboardOpen])
  }

  const popperContext = {
    size,
    arrowRef: setArrow,
    arrowStyle: middlewareData.arrow,
    onArrowSize: setArrowSize,
    isMounted,
    scope: __scopePopper,
    hasFloating: middlewareData.checkFloating?.hasFloating,
    ...floating,
  }

  return <PopperProvider {...popperContext}>{children}</PopperProvider>
}

/* -------------------------------------------------------------------------------------------------
 * PopperAnchor
 * -----------------------------------------------------------------------------------------------*/

type PopperAnchorRef = HTMLElement | View

export type PopperAnchorProps = YStackProps & {
  virtualRef?: React.RefObject<any>
}

export const PopperAnchor = YStack.extractable(
  React.forwardRef<PopperAnchorRef, ScopedPopperProps<PopperAnchorProps>>(
    function PopperAnchor(props: ScopedPopperProps<PopperAnchorProps>, forwardedRef) {
      const { virtualRef, __scopePopper, ...anchorProps } = props
      const { getReferenceProps, refs } = usePopperContext(__scopePopper)
      const ref = React.useRef<PopperAnchorRef>(null)
      const composedRefs = useComposedRefs(forwardedRef, ref, refs.setReference as any)

      React.useEffect(() => {
        if (virtualRef) {
          refs.setReference(virtualRef.current)
        }
      }, [virtualRef])

      if (virtualRef) {
        return null
      }
      const stackProps = {
        ref: composedRefs,
        ...anchorProps,
      }
      return (
        <TamaguiView
          {...(getReferenceProps ? getReferenceProps(stackProps) : stackProps)}
        />
      )
    }
  )
)

/* -------------------------------------------------------------------------------------------------
 * PopperContent
 * -----------------------------------------------------------------------------------------------*/

type PopperContentElement = HTMLElement | View

export type PopperContentProps = SizableStackProps & {
  enableAnimationForPositionChange?: boolean
}

export const PopperContentFrame = styled(ThemeableStack, {
  name: 'PopperContent',

  variants: {
    unstyled: {
      false: {
        size: '$true',
        backgroundColor: '$background',
        alignItems: 'center',
        radiused: true,
      },
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

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

export const PopperContent = React.forwardRef<
  PopperContentElement,
  ScopedPopperProps<PopperContentProps>
>(function PopperContent(props: ScopedPopperProps<PopperContentProps>, forwardedRef) {
  const { __scopePopper, enableAnimationForPositionChange, ...rest } = props
  const {
    strategy,
    placement,
    refs,
    x,
    y,
    getFloatingProps,
    size,
    isMounted,
    update,
    floatingStyles,
    hasFloating,
  } = usePopperContext(__scopePopper)
  const contentRefs = useComposedRefs<any>(refs.setFloating, forwardedRef)

  let finalHasFloatingValue = false
  if (isAndroid) {
    const initialRender = React.useRef(true)
    const finalHasFloating = React.useRef(false)

    if (hasFloating === false) {
      initialRender.current = false
    }

    if (!initialRender.current) {
      finalHasFloating.current = hasFloating
    }
    finalHasFloatingValue = finalHasFloating.current
  }

  const contents = React.useMemo(() => {
    return (
      <PopperContentFrame
        key="popper-content-frame"
        data-placement={placement}
        data-strategy={strategy}
        contain="layout"
        size={size}
        {...rest}
      />
    )
  }, [placement, strategy, props])

  const [needsMeasure, setNeedsMeasure] = React.useState(true)
  React.useEffect(() => {
    if (x || y) {
      setNeedsMeasure(false)
    }
  }, [x, y])

  useIsomorphicLayoutEffect(() => {
    if (isMounted) {
      update()
    }
  }, [isMounted])

  // all poppers hidden on ssr by default
  if (!isMounted) {
    return null
  }

  let show = true
  let setShow = undefined as any

  if (isAndroid) {
    ;[show, setShow] = React.useState(false)

    React.useEffect(() => {
      if (finalHasFloatingValue) {
        setShow(true)
      }
    }, [finalHasFloatingValue, x, y])
  }

  const frameProps = {
    ref: contentRefs,
    x: x || 0,
    y: y || 0,
    top: 0,
    left: 0,
    position: strategy,
    opacity: show ? 1 : 0,
    ...(enableAnimationForPositionChange && {
      // apply animation but disable it on initial render to avoid animating from 0 to the first position
      animation: rest.animation,
      animateOnly: needsMeasure ? ['none'] : rest.animateOnly,
      animatePresence: false,
    }),
  }

  // outer frame because we explicitly don't want animation to apply to this
  return (
    <Stack {...(getFloatingProps ? getFloatingProps(frameProps) : frameProps)}>
      {contents}
    </Stack>
  )
})

/* -------------------------------------------------------------------------------------------------
 * PopperArrow
 * -----------------------------------------------------------------------------------------------*/

export type PopperArrowExtraProps = {
  offset?: number
  size?: SizeTokens
  __scopePopper?: string
}

export type PopperArrowProps = YStackProps & PopperArrowExtraProps

const PopperArrowFrame = styled(YStack, {
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
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
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
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

const opposites = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
} as const

type Sides = keyof typeof opposites

export const PopperArrow = PopperArrowFrame.styleable<PopperArrowExtraProps>(
  function PopperArrow(propsIn: ScopedPopperProps<PopperArrowProps>, forwardedRef) {
    const { __scopePopper, ...rest } = propsIn
    const props = useProps(rest)
    const { offset, size: sizeProp, borderWidth = 0, ...arrowProps } = props

    const context = usePopperContext(__scopePopper)
    const sizeVal = sizeProp ?? context.size
    const sizeValResolved = getVariableValue(
      getSpace(sizeVal, {
        shift: -2,
        bounds: [2],
      })
    )
    const size = Math.max(0, +sizeValResolved)

    const { placement } = context
    const refs = useComposedRefs(context.arrowRef, forwardedRef)

    // Sometimes floating-ui can return NaN during orientation or screen size changes on native
    // so we explicitly force the x,y position types as a number
    const x = (context.arrowStyle?.x as number) || 0
    const y = (context.arrowStyle?.y as number) || 0

    const primaryPlacement = (placement ? placement.split('-')[0] : 'top') as Sides

    const arrowStyle: StackProps = { x, y, width: size, height: size }

    const innerArrowStyle: StackProps = {}
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
      <PopperArrowOuterFrame ref={refs} {...arrowStyle}>
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
