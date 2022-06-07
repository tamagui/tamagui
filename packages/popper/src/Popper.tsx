// adapted from radix-ui popper

import { useComposedRefs } from '@tamagui/compose-refs'
import {
  SizeTokens,
  StackProps,
  getTokens,
  getVariableValue,
  stepTokenUpOrDown,
  styled,
  useIsomorphicLayoutEffect,
} from '@tamagui/core'
import { Scope, createContextScope } from '@tamagui/create-context'
import { SizableStack, SizableStackProps, YStack, YStackProps } from '@tamagui/stacks'
import * as React from 'react'
import { View } from 'react-native'

import { Coords, Placement, arrow, autoUpdate, flip, offset, shift } from './floating'
import { UseFloatingResult, useFloating } from './useFloating'

type ShiftProps = typeof shift extends (options: infer Opts) => void ? Opts : never
type FlipProps = typeof flip extends (options: infer Opts) => void ? Opts : never

/* -------------------------------------------------------------------------------------------------
 * Popper
 * -----------------------------------------------------------------------------------------------*/

const POPPER_NAME = 'Popper'

type ScopedProps<P> = P & { __scopePopper?: Scope }
const [createPopperContext, createScope] = createContextScope(POPPER_NAME)

export const createPopperScope = createScope

type PopperContextValue = UseFloatingResult & {
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
const [PopperProvider, usePopperContext] = createPopperContext<PopperContextValue>(POPPER_NAME)

export type PopperProps = {
  size?: SizeTokens
  children?: React.ReactNode
  placement?: Placement
  stayInFrame?: ShiftProps
  allowFlip?: FlipProps
}

export const Popper: React.FC<PopperProps> = (props: ScopedProps<PopperProps>) => {
  const { __scopePopper, children, size, placement = 'bottom', stayInFrame, allowFlip } = props

  const [isMounted, setIsMounted] = React.useState(false)
  useIsomorphicLayoutEffect(() => {
    setIsMounted(true)
  }, [])

  const anchorRef = React.useRef<any>()
  const [arrowEl, setArrow] = React.useState<HTMLSpanElement | null>(null)
  const [arrowSize, setArrowSize] = React.useState(0)
  const arrowRef = React.useRef()

  const floating = useFloating({
    placement,
    middleware: [
      stayInFrame ? shift(stayInFrame) : (null as any),
      allowFlip ? flip(allowFlip) : (null as any),
      arrowEl ? arrow({ element: arrowEl }) : (null as any),
      arrowSize ? offset(arrowSize) : (null as any),
    ].filter(Boolean),
  })

  const { refs, middlewareData } = floating

  const composedArrowRefs = useComposedRefs<any>(arrowRef, setArrow)

  useIsomorphicLayoutEffect(() => {
    floating.reference(anchorRef.current)
  }, [anchorRef])

  React.useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) {
      return
    }
    // Only call this when the floating element is rendered
    return autoUpdate(refs.reference.current, refs.floating.current, floating.update)
  }, [refs.floating.current, refs.reference.current])

  const arrowStyle = React.useMemo(() => {
    return middlewareData.arrow
  }, [JSON.stringify(middlewareData.arrow || {})])

  return (
    <PopperProvider
      scope={__scopePopper}
      anchorRef={anchorRef}
      size={size}
      arrowRef={composedArrowRefs}
      arrowStyle={arrowStyle}
      onArrowSize={setArrowSize}
      isMounted={isMounted}
      {...floating}
    >
      {children}
    </PopperProvider>
  )
}

Popper.displayName = POPPER_NAME

/* -------------------------------------------------------------------------------------------------
 * PopperAnchor
 * -----------------------------------------------------------------------------------------------*/

const ANCHOR_NAME = 'PopperAnchor'

type PopperAnchorRef = HTMLElement | View

export type PopperAnchorProps = YStackProps & {
  virtualRef?: React.RefObject<any>
}

export const PopperAnchor = React.forwardRef<PopperAnchorRef, PopperAnchorProps>(
  (props: ScopedProps<PopperAnchorProps>, forwardedRef) => {
    const { __scopePopper, virtualRef, ...anchorProps } = props
    const { anchorRef, getReferenceProps } = usePopperContext(ANCHOR_NAME, __scopePopper)
    const ref = React.useRef<PopperAnchorRef>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref, anchorRef)
    if (virtualRef) {
      return null
    }
    const stackProps = {
      ref: composedRefs,
      ...anchorProps,
    }
    return <YStack {...(getReferenceProps ? getReferenceProps(stackProps) : stackProps)} />
  }
)

PopperAnchor.displayName = ANCHOR_NAME

/* -------------------------------------------------------------------------------------------------
 * PopperContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'PopperContent'

type PopperContentElement = HTMLElement | View

export type PopperContentProps = SizableStackProps

const PopperContentFrame = styled(SizableStack, {
  name: 'PopperContent',
  backgroundColor: '$background',
  alignItems: 'center',

  defaultVariants: {
    size: '$4',
  },
})

export const PopperContent = PopperContentFrame.extractable(
  React.forwardRef<PopperContentElement, PopperContentProps>(
    (props: ScopedProps<PopperContentProps>, forwardedRef) => {
      const { __scopePopper, ...contentProps } = props
      const { strategy, placement, floating, x, y, getFloatingProps, size, isMounted } =
        usePopperContext(CONTENT_NAME, __scopePopper)
      const contentRefs = useComposedRefs<any>(floating, forwardedRef)

      const contents = React.useMemo(() => {
        return (
          <PopperContentFrame
            key="popper-content-frame"
            data-placement={placement}
            data-strategy={strategy}
            {...contentProps}
            size={contentProps.size ?? size}
          />
        )
      }, [placement, strategy, props])

      // all poppers hidden on ssr by default
      if (!isMounted) {
        return null
      }

      const frameProps = {
        ref: contentRefs,
        x: (x as any) || 0,
        y: (y as any) || 0,
        position: 'absolute',
      }

      // outer frame because we explicitly dont want animation to apply to this
      return (
        <YStack {...(getFloatingProps ? getFloatingProps(frameProps) : frameProps)}>
          {contents}
        </YStack>
      )
    }
  )
)

PopperContent.displayName = CONTENT_NAME

/* -------------------------------------------------------------------------------------------------
 * PopperArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'PopperArrow'

type PopperArrowElement = HTMLElement | View

export type PopperArrowProps = YStackProps & {
  offset?: number
  size?: SizeTokens
}

const PopperArrowFrame = styled(YStack, {
  name: 'PopperArrow',
  borderColor: '$borderColor',
  backgroundColor: '$background',
  position: 'absolute',
  zIndex: 0,
  pointerEvents: 'none',
  // TODO bug not applying
  // rotate: '45deg',
})

const opposites = {
  top: 'bottom',
  right: 'left',
  bottom: 'top',
  left: 'right',
}

export const PopperArrow = PopperArrowFrame.extractable(
  React.forwardRef<PopperArrowElement, PopperArrowProps>(function PopperArrow(
    props: ScopedProps<PopperArrowProps>,
    forwardedRef
  ) {
    const { __scopePopper, offset, size: sizeProp, borderWidth = 0, ...arrowProps } = props
    const context = usePopperContext(ARROW_NAME, __scopePopper)
    const tokens = getTokens()
    const sizeVal = sizeProp ?? context.size
    const sizeValResolved = getVariableValue(stepTokenUpOrDown(tokens.space, sizeVal, 0))
    const size = +sizeValResolved
    const { placement } = context
    const { x, y } = context.arrowStyle || { x: 0, y: 0 }
    const refs = useComposedRefs(context.arrowRef, forwardedRef)

    const primaryPlacement = placement ? placement.split('-')[0] : 'top'

    let arrowStyle: StackProps = { x, y, width: size, height: size }
    if (primaryPlacement) {
      const oppSide = opposites[primaryPlacement]
      if (oppSide) {
        arrowStyle[oppSide] = -size / 2
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

    return (
      <PopperArrowFrame
        {...arrowProps}
        ref={refs}
        {...arrowStyle}
        rotate="45deg"
        {...(primaryPlacement === 'top' && {
          borderBottomWidth: borderWidth,
          borderRightWidth: borderWidth,
        })}
        {...(primaryPlacement === 'bottom' && {
          borderTopWidth: borderWidth,
          borderLeftWidth: borderWidth,
        })}
        {...(primaryPlacement === 'left' && {
          borderTopWidth: borderWidth,
          borderRightWidth: borderWidth,
        })}
        {...(primaryPlacement === 'right' && {
          borderBottomWidth: borderWidth,
          borderLeftWidth: borderWidth,
        })}
      />
    )
  })
)

PopperArrow.displayName = ARROW_NAME

/* -----------------------------------------------------------------------------------------------*/
