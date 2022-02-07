import { StackProps, styled } from '@tamagui/core'
import type { ReactElement, RefObject } from 'react'
import React, { createContext, useContext, useRef } from 'react'
import { View, ViewStyle } from 'react-native'

import { YStack } from './Stacks'

export type IPopoverArrowProps = {
  height?: any
  width?: any
  children?: any
  color?: any
  style?: any
}

export type IPlacementCentered = 'top' | 'bottom' | 'left' | 'right'

export type IPlacement =
  | 'top left'
  | 'top right'
  | 'bottom left'
  | 'bottom right'
  | 'right top'
  | 'right bottom'
  | 'left top'
  | 'left bottom'

export type IPopperProps = {
  shouldFlip?: boolean
  crossOffset?: number
  offset?: number
  children: React.ReactNode
  shouldOverlapWithTrigger?: boolean
  trigger?: ReactElement | RefObject<any>
  placement?: IPlacement
}

export type IArrowStyles = {
  placement?: IPlacementCentered
  height?: number
  width?: number
}

export type IScrollContentStyle = {
  placement?: IPlacementCentered
  arrowHeight: number
  arrowWidth: number
}

const defaultArrowHeight = 15
const defaultArrowWidth = 15

const getDiagonalLength = (height: number, width: number) => {
  return Math.pow(height * height + width * width, 0.5)
}

type PopperContext = IPopperProps & {
  triggerRef: any
  onClose: any
  setOverlayRef?: (overlayRef: any) => void
}

const PopperContext = createContext<PopperContext | null>(null)

export const Popper = (
  props: IPopperProps & {
    triggerRef: any
    onClose: any
    setOverlayRef?: (overlayRef: any) => void
  }
) => {
  return <PopperContext.Provider value={props}>{props.children}</PopperContext.Provider>
}

const PopperContent = React.forwardRef(({ children, style, ...rest }: any, ref: any) => {
  const context = useContext(PopperContext) || ({} as any)
  const {
    triggerRef,
    shouldFlip,
    crossOffset,
    offset,
    placement: placementProp,
    onClose,
    shouldOverlapWithTrigger,
    setOverlayRef,
  } = context
  const overlayRef = useRef(null)
  // const { top } = useSafeAreaInsets()

  let restElements: React.ReactNode[] = []
  let arrowElement: React.ReactElement | null = null

  return (
    <Overlay
      {...(!rendered && {
        backgroundColor: 'transparent',
        pointerEvents: 'none',
      })}
    >
      {arrowElement}
      <View ref={ref}>{restElements}</View>
    </Overlay>
  )
})

const Overlay = styled(YStack, {
  backgroundColor: '$bg',
  fullscreen: true,
})

// This is an internal implementation of PopoverArrow
export type PopperArrowProps = StackProps & {
  placement?: IPlacementCentered
}

const PopperArrow = React.forwardRef(
  (
    {
      height = defaultArrowHeight,
      width = defaultArrowWidth,
      placement,
      style,
      borderColor = '#52525b',
      backgroundColor = 'black',
      ...rest
    }: PopperArrowProps,
    ref: any
  ) => {
    const additionalStyles = React.useMemo(
      () => getArrowStyles({ placement, height: +height, width: +width }),
      [placement, height, width]
    )

    // @ts-ignore
    let triangleStyle: ViewStyle = React.useMemo(
      () => ({
        position: 'absolute',
        width,
        height,
      }),
      [width, height]
    )

    let arrowStyles = React.useMemo(
      // @ts-ignore
      () => [triangleStyle, additionalStyles, style],
      // @ts-ignore
      [triangleStyle, additionalStyles, style]
    )

    return (
      <YStack
        ref={ref}
        style={arrowStyles}
        borderColor={borderColor}
        backgroundColor={backgroundColor}
        zIndex={1}
        {...rest}
      />
    )
  }
)

PopperArrow.displayName = 'PopperArrow'
Popper.Content = PopperContent
Popper.Arrow = PopperArrow

const getArrowStyles = (props: IArrowStyles) => {
  let additionalStyles: any = {
    transform: [],
  }

  const diagonalLength = getDiagonalLength(defaultArrowHeight, defaultArrowHeight)

  if (props.placement === 'top' && props.width) {
    additionalStyles.transform.push({ translateX: -props.width / 2 })
    additionalStyles.transform.push({ rotate: '45deg' })
    additionalStyles.bottom = Math.ceil((diagonalLength - defaultArrowHeight) / 2)
    additionalStyles.borderBottomWidth = 1
    additionalStyles.borderRightWidth = 1
  }

  if (props.placement === 'bottom' && props.width) {
    additionalStyles.transform.push({ translateX: -props.width / 2 })
    additionalStyles.transform.push({ rotate: '45deg' })
    additionalStyles.top = Math.ceil((diagonalLength - defaultArrowHeight) / 2)
    additionalStyles.borderTopWidth = 1
    additionalStyles.borderLeftWidth = 1
  }

  if (props.placement === 'left' && props.height) {
    additionalStyles.transform.push({ translateY: -props.height / 2 })
    additionalStyles.transform.push({ rotate: '45deg' })
    additionalStyles.right = Math.ceil((diagonalLength - defaultArrowHeight) / 2)
    additionalStyles.borderTopWidth = 1
    additionalStyles.borderRightWidth = 1
  }

  if (props.placement === 'right' && props.height) {
    additionalStyles.transform.push({ translateY: -props.height / 2 })
    additionalStyles.transform.push({ rotate: '45deg' })
    additionalStyles.left = Math.ceil((diagonalLength - defaultArrowHeight) / 2)
    additionalStyles.borderBottomWidth = 1
    additionalStyles.borderLeftWidth = 1
  }

  return additionalStyles
}
