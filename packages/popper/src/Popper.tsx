import { Placement, shift } from '@floating-ui/react-dom'
import { arrow, flip } from '@floating-ui/react-native'
import { useComposedRefs } from '@tamagui/compose-refs'
import { Scope, createContextScope } from '@tamagui/create-context'
import { YStack, YStackProps } from '@tamagui/stacks'
import * as React from 'react'
import { View } from 'react-native'

import { useFloating } from './floating'

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
  // anchor: Measurable | null
  // onAnchorChange(anchor: Measurable | null): void
}
const [PopperProvider, usePopperContext] = createPopperContext<PopperContextValue>(POPPER_NAME)

export type PopperProps = {
  children?: React.ReactNode
}

export const Popper: React.FC<PopperProps> = (props: ScopedProps<PopperProps>) => {
  const { __scopePopper, children } = props
  // const [anchor, setAnchor] = React.useState<Measurable | null>(null)
  return (
    <PopperProvider
      scope={__scopePopper}
      // anchor={anchor} onAnchorChange={setAnchor}
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

type PopperAnchorRef = React.Ref<HTMLDivElement | View>

export type PopperAnchorProps = YStackProps & {
  virtualRef?: React.RefObject<any>
}

export const PopperAnchor = React.forwardRef<PopperAnchorRef, PopperAnchorProps>(
  (props: ScopedProps<PopperAnchorProps>, forwardedRef) => {
    const { __scopePopper, virtualRef, ...anchorProps } = props
    const context = usePopperContext(ANCHOR_NAME, __scopePopper)
    const ref = React.useRef<PopperAnchorRef>(null)
    const composedRefs = useComposedRefs(forwardedRef, ref)

    React.useEffect(() => {
      // Consumer can anchor the popper to something that isn't
      // a DOM node e.g. pointer position, so we override the
      // `anchorRef` with their virtual ref in this case.
      // context.onAnchorChange(virtualRef?.current || ref.current)
    })

    return virtualRef ? null : <YStack {...anchorProps} ref={composedRefs} />
  }
)

PopperAnchor.displayName = ANCHOR_NAME

/* -------------------------------------------------------------------------------------------------
 * PopperContent
 * -----------------------------------------------------------------------------------------------*/

const CONTENT_NAME = 'PopperContent'

type PopperContentContextValue = {
  arrowStyles: React.CSSProperties
  onArrowChange(arrow: HTMLSpanElement | null): void
  onArrowOffsetChange(offset?: number): void
}

const [PopperContentProvider, useContentContext] =
  createPopperContext<PopperContentContextValue>(CONTENT_NAME)

type PopperContentElement = any
type PopperContentProps = YStackProps & {
  placement?: Placement
  stayInFrame?: ShiftProps
  allowFlip?: FlipProps

  // sideOffset?: number
  // align?: Align
  // alignOffset?: number
  // collisionTolerance?: number
  // avoidCollisions?: boolean
}

export const PopperContent = React.forwardRef<PopperContentElement, PopperContentProps>(
  (props: ScopedProps<PopperContentProps>, forwardedRef) => {
    const {
      __scopePopper,
      placement,
      stayInFrame,
      allowFlip,
      // side = 'bottom',
      // sideOffset,
      // align = 'center',
      // alignOffset,
      // collisionTolerance,
      // avoidCollisions = true,
      ...contentProps
    } = props

    const context = usePopperContext(CONTENT_NAME, __scopePopper)
    const [arrowOffset, setArrowOffset] = React.useState<number>()
    // const anchorRect = useRect(context.anchor)
    const [content, setContent] = React.useState<HTMLDivElement | null>(null)
    // const contentSize = useSize(content)
    const [arrowEl, setArrow] = React.useState<HTMLSpanElement | null>(null)
    // const arrowSize = useSize(arrow)

    const { x, y, reference, floating } = useFloating({
      placement,
      // @ts-ignore
      middleware: [
        stayInFrame ? shift(stayInFrame) : null,
        allowFlip ? flip(allowFlip) : null,
        arrowEl ? arrow({ element: { ref: arrowEl } }) : null,
      ].filter(Boolean),
    })

    const composedRefs = useComposedRefs<any>(forwardedRef, (node) => setContent(node))

    // const collisionBoundariesRect = windowSize
    //   ? DOMRect.fromRect({ ...windowSize, x: 0, y: 0 })
    //   : undefined

    // const { popperStyles, arrowStyles, placedSide, placedAlign } = getPlacementData({
    //   anchorRect,
    //   popperSize: contentSize,
    //   arrowSize,

    //   // config
    //   arrowOffset,
    //   side,
    //   sideOffset,
    //   align,
    //   alignOffset,
    //   shouldAvoidCollisions: avoidCollisions,
    //   collisionBoundariesRect,
    //   collisionTolerance,
    // })

    // const isPlaced = placedSide !== undefined

    return (
      <div
        // style={popperStyles}
        data-radix-popper-content-wrapper=""
      >
        <PopperContentProvider
          scope={__scopePopper}
          // arrowStyles={arrowStyles}
          arrowStyles={{}}
          onArrowChange={setArrow}
          onArrowOffsetChange={setArrowOffset}
        >
          <YStack
            // data-side={placedSide}
            // data-align={placedAlign}
            {...contentProps}
            // style={{
            //   ...contentProps.style,
            //   // if the PopperContent hasn't been placed yet (not all measurements done)
            //   // we prevent animations so that users's animation don't kick in too early referring wrong sides
            //   animation: !isPlaced ? 'none' : undefined,
            // }}
            ref={composedRefs}
          />
        </PopperContentProvider>
      </div>
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
}

export const PopperArrow = React.forwardRef<PopperArrowElement, PopperArrowProps>(
  function PopperArrow(props: ScopedProps<PopperArrowProps>, forwardedRef) {
    const { __scopePopper, offset, ...arrowProps } = props
    const context = useContentContext(ARROW_NAME, __scopePopper)
    const { onArrowOffsetChange } = context

    // send the Arrow's offset up to Popper
    React.useEffect(() => onArrowOffsetChange(offset), [onArrowOffsetChange, offset])

    return (
      <span style={{ ...context.arrowStyles, pointerEvents: 'none' }}>
        <span
          // we have to use an extra wrapper because `ResizeObserver` (used by `useSize`)
          // doesn't report size as we'd expect on SVG elements.
          // it reports their bounding box which is effectively the largest path inside the SVG.
          ref={context.onArrowChange}
          style={{
            display: 'inline-block',
            verticalAlign: 'top',
            pointerEvents: 'auto',
          }}
        >
          <YStack
            {...arrowProps}
            ref={forwardedRef}
            // style={{
            //   ...arrowProps.style,
            //   // ensures the element can be measured correctly (mostly for if SVG)
            //   display: 'block',
            // }}
          />
        </span>
      </span>
    )
  }
)

PopperArrow.displayName = ARROW_NAME

/* -----------------------------------------------------------------------------------------------*/

const WINDOW_RESIZE_DEBOUNCE_WAIT_IN_MS = 100
