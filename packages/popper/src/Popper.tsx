// adapted from radix-ui popper

import { useComposedRefs } from '@tamagui/compose-refs'
import {
  SizeTokens,
  StackProps,
  View as TamaguiView,
  createStyledContext,
  getVariableValue,
  isWeb,
  styled,
  useIsomorphicLayoutEffect,
  useProps,
} from '@tamagui/core'
import {
  Coords,
  OffsetOptions,
  Placement,
  Strategy,
  UseFloatingReturn,
  arrow,
  autoUpdate,
  flip,
  offset as offsetFn,
  shift,
  useFloating,
} from '@tamagui/floating'
import { getSpace } from '@tamagui/get-token'
import { SizableStackProps, ThemeableStack, YStack, YStackProps } from '@tamagui/stacks'
import * as React from 'react'
import { Keyboard, View, useWindowDimensions } from 'react-native'

type ShiftProps = typeof shift extends (options: infer Opts) => void ? Opts : never
type FlipProps = typeof flip extends (options: infer Opts) => void ? Opts : never

/* -------------------------------------------------------------------------------------------------
 * Popper
 * -----------------------------------------------------------------------------------------------*/

type PopperContextValue = UseFloatingReturn & {
  isMounted: boolean
  anchorRef: any
  size?: SizeTokens
  placement?: Placement
  arrowRef: any
  onArrowSize?: (val: number) => void
  arrowStyle?: Partial<Coords> & {
    centerOffset: number
  }
}

export const PopperContext = createStyledContext<PopperContextValue>({} as any)

export const usePopperContext = () => React.useContext(PopperContext)

export type PopperProps = {
  size?: SizeTokens
  children?: React.ReactNode
  placement?: Placement
  stayInFrame?: ShiftProps | boolean
  allowFlip?: FlipProps | boolean
  strategy?: Strategy
  offset?: OffsetOptions
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
  } = props

  const [isMounted, setIsMounted] = React.useState(false)
  useIsomorphicLayoutEffect(() => {
    setIsMounted(true)
  }, [])

  const [anchorRef, setAnchorRef] = React.useState<any>()
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
    ].filter(Boolean),
  })

  const { refs, middlewareData } = floating

  useIsomorphicLayoutEffect(() => {
    floating.refs.setReference(anchorRef)
  }, [anchorRef])

  if (isWeb) {
    React.useEffect(() => {
      if (!(refs.reference.current && refs.floating.current)) {
        return
      }
      // Only call this when the floating element is rendered
      return autoUpdate(refs.reference.current, refs.floating.current, floating.update)
    }, [floating.update, refs.floating, refs.reference])
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

  return (
    <PopperContext.Provider
      anchorRef={setAnchorRef}
      size={size}
      arrowRef={setArrow}
      arrowStyle={middlewareData.arrow}
      onArrowSize={setArrowSize}
      isMounted={isMounted}
      {...floating}
    >
      {children}
    </PopperContext.Provider>
  )
}

/* -------------------------------------------------------------------------------------------------
 * PopperAnchor
 * -----------------------------------------------------------------------------------------------*/

type PopperAnchorRef = HTMLElement | View

export type PopperAnchorProps = YStackProps & {
  virtualRef?: React.RefObject<any>
}

export const PopperAnchor = YStack.extractable(
  React.forwardRef<PopperAnchorRef, PopperAnchorProps>(function PopperAnchor(
    props: PopperAnchorProps,
    forwardedRef
  ) {
    const { virtualRef, ...anchorProps } = props
    const { anchorRef, getReferenceProps } = usePopperContext()
    const ref = React.useRef<PopperAnchorRef>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref, anchorRef)
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
  })
)

/* -------------------------------------------------------------------------------------------------
 * PopperContent
 * -----------------------------------------------------------------------------------------------*/

type PopperContentElement = HTMLElement | View

export type PopperContentProps = SizableStackProps

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
    unstyled: false,
  },
})

export const PopperContent = React.forwardRef<PopperContentElement, PopperContentProps>(
  function PopperContent(props: PopperContentProps, forwardedRef) {
    const { strategy, placement, refs, x, y, getFloatingProps, size, isMounted, update } =
      usePopperContext()
    const contentRefs = useComposedRefs<any>(refs.setFloating, forwardedRef)

    const contents = React.useMemo(() => {
      return (
        <PopperContentFrame
          key="popper-content-frame"
          data-placement={placement}
          data-strategy={strategy}
          size={size}
          {...props}
        />
      )
    }, [placement, strategy, props])

    useIsomorphicLayoutEffect(() => {
      if (isMounted) {
        update()
      }
    }, [isMounted])

    // all poppers hidden on ssr by default
    if (!isMounted) {
      return null
    }

    const frameProps = {
      ref: contentRefs,
      x: x || 0,
      y: y || 0,
      position: strategy,
    }

    // outer frame because we explicitly dont want animation to apply to this
    return (
      <YStack {...(getFloatingProps ? getFloatingProps(frameProps) : frameProps)}>
        {contents}
      </YStack>
    )
  }
)

/* -------------------------------------------------------------------------------------------------
 * PopperArrow
 * -----------------------------------------------------------------------------------------------*/

export type PopperArrowProps = YStackProps & {
  offset?: number
  size?: SizeTokens
}

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
    unstyled: false,
  },
})

const PopperArrowOuterFrame = styled(YStack, {
  name: 'PopperArrowOuter',

  variants: {
    unstyled: {
      false: {
        position: 'absolute',
        zIndex: -1,
        pointerEvents: 'none',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  } as const,

  defaultVariants: {
    unstyled: false,
  },
})

const opposites = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
} as const

type Sides = keyof typeof opposites

export const PopperArrow = PopperArrowFrame.styleable<PopperArrowProps>(
  function PopperArrow(propsIn: PopperArrowProps, forwardedRef) {
    const props = useProps(propsIn)
    const { offset, size: sizeProp, borderWidth = 0, ...arrowProps } = props

    const context = usePopperContext()
    const sizeVal = sizeProp ?? context.size
    const sizeValResolved = getVariableValue(
      getSpace(sizeVal, {
        shift: -2,
        bounds: [2],
      })
    )
    const size = +sizeValResolved
    const { placement } = context
    const refs = useComposedRefs(context.arrowRef, forwardedRef)

    // Sometimes floating-ui can return NaN during orientation or screen size changes on native
    // so we explictly force the x,y position types as a number
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
    }

    // send the Arrow's offset up to Popper
    useIsomorphicLayoutEffect(() => {
      context.onArrowSize?.(size)
    }, [size, context.onArrowSize])

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
