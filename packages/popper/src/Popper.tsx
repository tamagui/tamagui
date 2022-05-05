// adapted from radix-ui popper

import { Coords, Placement, offset, shift } from '@floating-ui/react-dom'
import { arrow, flip } from '@floating-ui/react-native'
import { useComposedRefs } from '@tamagui/compose-refs'
import { SizeTokens, getTokens, getVariableValue, styled } from '@tamagui/core'
import { Scope, createContextScope } from '@tamagui/create-context'
import { SizableStack, YStack, YStackProps } from '@tamagui/stacks'
import * as React from 'react'
import { View } from 'react-native'

import { autoUpdate, useFloating } from './floating'

type ShiftProps = typeof shift extends (options: infer Opts) => void ? Opts : never
type FlipProps = typeof flip extends (options: infer Opts) => void ? Opts : never

/* -------------------------------------------------------------------------------------------------
 * Popper
 * -----------------------------------------------------------------------------------------------*/

const POPPER_NAME = 'Popper'

type ScopedProps<P> = P & { __scopePopper?: Scope }
const [createPopperContext, createScope] = createContextScope(POPPER_NAME)

export const createPopperScope = createScope

type PopperContextValue = {
  anchorRef: any
  size?: SizeTokens
}
const [PopperProvider, usePopperContext] = createPopperContext<PopperContextValue>(POPPER_NAME)

export type PopperProps = {
  size?: SizeTokens
  children?: React.ReactNode
}

export const Popper: React.FC<PopperProps> = (props: ScopedProps<PopperProps>) => {
  const { __scopePopper, children, size } = props
  const anchorRef = React.useRef()
  return (
    <PopperProvider scope={__scopePopper} anchorRef={anchorRef} size={size}>
      {children}
    </PopperProvider>
  )
}

Popper.displayName = POPPER_NAME

/* -------------------------------------------------------------------------------------------------
 * PopperAnchor
 * -----------------------------------------------------------------------------------------------*/

const ANCHOR_NAME = 'PopperAnchor'

type PopperAnchorRef = React.Ref<HTMLDivElement | View>

export type PopperAnchorProps = YStackProps & {
  virtualRef?: React.RefObject<any>
}

export const PopperAnchor = React.forwardRef<PopperAnchorRef, PopperAnchorProps>(
  (props: ScopedProps<PopperAnchorProps>, forwardedRef) => {
    const { __scopePopper, virtualRef, ...anchorProps } = props
    const context = usePopperContext(ANCHOR_NAME, __scopePopper)
    const ref = React.useRef<PopperAnchorRef>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref, context.anchorRef)
    return virtualRef ? null : <YStack {...anchorProps} ref={composedRefs} />
  }
)

PopperAnchor.displayName = ANCHOR_NAME

/* -------------------------------------------------------------------------------------------------
 * PopperContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'PopperContent'

type PopperContentContextValue = {
  size?: SizeTokens
  placement?: Placement
  arrowRef: any
  onArrowSize?: (val: number) => void
  arrowStyle?: Partial<Coords> & {
    centerOffset: number
  }
}

const [PopperContentProvider, useContentContext] =
  createPopperContext<PopperContentContextValue>(CONTENT_NAME)

type PopperContentElement = any

export type PopperContentProps = YStackProps & {
  size?: SizeTokens
  placement?: Placement
  stayInFrame?: ShiftProps
  allowFlip?: FlipProps
}

const PopperContentFrame = styled(SizableStack, {
  name: 'PopperContent',
  backgroundColor: '$background',
  alignItems: 'center',

  defaultVariants: {
    size: '$4',
  },
})

export const PopperContent = React.forwardRef<PopperContentElement, PopperContentProps>(
  (props: ScopedProps<PopperContentProps>, forwardedRef) => {
    const {
      __scopePopper,
      size,
      placement = 'bottom',
      stayInFrame,
      allowFlip,
      ...contentProps
    } = props

    const context = usePopperContext(CONTENT_NAME, __scopePopper)
    const [arrowEl, setArrow] = React.useState<HTMLSpanElement | null>(null)
    const [arrowSize, setArrowSize] = React.useState(0)
    const arrowRef = React.useRef()

    const { x, y, reference, floating, refs, update, middlewareData, ...rest } = useFloating({
      placement,
      middleware: [
        stayInFrame ? shift(stayInFrame) : (null as any),
        allowFlip ? flip(allowFlip) : (null as any),
        arrowEl ? arrow({ element: arrowEl }) : (null as any),
        arrowSize ? offset(arrowSize) : (null as any),
      ].filter(Boolean),
    })

    const contentRefs = useComposedRefs<any>(floating, forwardedRef)
    const composedArrowRefs = useComposedRefs<any>(arrowRef, setArrow)

    React.useLayoutEffect(() => {
      reference(context.anchorRef.current)
    }, [context.anchorRef])

    React.useEffect(() => {
      if (!refs.reference.current || !refs.floating.current) {
        return
      }
      // Only call this when the floating element is rendered
      return autoUpdate(refs.reference.current, refs.floating.current, update)
    }, [refs.floating, refs.reference, update])

    const arrowStyle = React.useMemo(() => {
      return middlewareData.arrow
    }, [JSON.stringify(middlewareData.arrow || {})])

    const contents = React.useMemo(() => {
      return (
        <PopperContentFrame
          data-placement={rest.placement}
          data-strategy={rest.strategy}
          {...contentProps}
        />
      )
    }, [rest.placement, rest.strategy, props])

    return (
      <PopperContentProvider
        scope={__scopePopper}
        arrowRef={composedArrowRefs}
        arrowStyle={arrowStyle}
        size={size ?? context.size}
        placement={placement}
        onArrowSize={setArrowSize}
      >
        {/* outer frame because we explicitly dont want animation to apply to this */}
        <YStack
          ref={contentRefs}
          x={(x as any) || 0}
          y={(y as any) || 0}
          position={rest.strategy as any}
        >
          {contents}
        </YStack>
      </PopperContentProvider>
    )
  }
)

PopperContent.displayName = CONTENT_NAME

/* -------------------------------------------------------------------------------------------------
 * PopperArrow
 * -----------------------------------------------------------------------------------------------*/

const ARROW_NAME = 'PopperArrow'

type PopperArrowElement = typeof YStack

export type PopperArrowProps = YStackProps & {
  offset?: number
  size?: SizeTokens
}

const PopperArrowFrame = styled(YStack, {
  name: 'PopperArrow',
  borderColor: '$borderColor',
  backgroundColor: '$background',
  position: 'absolute',
  zIndex: 1,
  // TODO bug not applying
  // rotate: '45deg',
})

export const PopperArrow = React.forwardRef<PopperArrowElement, PopperArrowProps>(
  function PopperArrow(props: ScopedProps<PopperArrowProps>, forwardedRef) {
    const { __scopePopper, offset, size: sizeProp, borderWidth = 0, ...arrowProps } = props
    const context = useContentContext(ARROW_NAME, __scopePopper)
    const tokens = getTokens()
    const sizeVal = sizeProp ?? context.size
    const sizeValResolved = getVariableValue(tokens.size[sizeVal as any] ?? sizeVal ?? 12)
    const size = +sizeValResolved
    const { placement } = context
    const { x, y } = context.arrowStyle || { x: 0, y: 0 }
    const refs = useComposedRefs(context.arrowRef, forwardedRef)

    let arrowStyle = { x, y, width: size, height: size }
    if (placement) {
      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]]
      if (staticSide) {
        Object.assign(arrowStyle, {
          [staticSide]: -size / 2,
        })
      }
    }

    // send the Arrow's offset up to Popper
    React.useLayoutEffect(() => {
      context.onArrowSize?.(size)
    }, [size, context.onArrowSize])

    return (
      <PopperArrowFrame
        {...arrowProps}
        ref={refs}
        {...arrowStyle}
        rotate="45deg"
        left={0}
        {...(placement === 'top' && {
          borderBottomWidth: borderWidth,
          borderRightWidth: borderWidth,
        })}
        {...(placement === 'bottom' && {
          borderTopWidth: borderWidth,
          borderLeftWidth: borderWidth,
        })}
        {...(placement === 'left' && {
          borderTopWidth: borderWidth,
          borderRightWidth: borderWidth,
        })}
        {...(placement === 'right' && {
          borderBottomWidth: borderWidth,
          borderLeftWidth: borderWidth,
        })}
      />
    )
  }
)

PopperArrow.displayName = ARROW_NAME

/* -----------------------------------------------------------------------------------------------*/
