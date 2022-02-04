// forked from NativeBase
// The MIT License (MIT)

// Copyright (c) 2021 GeekyAnts India Pvt Ltd

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { useOverlayPosition } from '@react-native-aria/overlays'
import { StackProps } from '@tamagui/core'
import type { ReactElement, RefObject } from 'react'
import React, { createContext, useContext, useEffect, useRef } from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { YStack } from './Stacks'

export type IPopoverArrowProps = {
  height?: any
  width?: any
  children?: any
  color?: any
  style?: any
}

export type IPlacement =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
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
  placement?: string
  height?: number
  width?: number
}

export type IScrollContentStyle = {
  placement?: string
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
  console.log('triggerRef', triggerRef)
  // const { top } = useSafeAreaInsets()
  const { overlayProps, rendered, arrowProps, placement } = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    shouldFlip: shouldFlip,
    crossOffset: crossOffset,
    isOpen: true,
    offset: offset,
    placement: placementProp as any,
    containerPadding: 0,
    onClose: onClose,
    shouldOverlapWithTrigger,
  })

  let restElements: React.ReactNode[] = []
  let arrowElement: React.ReactElement | null = null

  useEffect(() => {
    setOverlayRef && setOverlayRef(overlayRef)
  }, [overlayRef, setOverlayRef])

  // Might have performance impact if there are a lot of siblings!
  // Shouldn't be an issue with popovers since it would have atmost 2. Arrow and Content.
  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement(child) &&
      // @ts-ignore
      child.type.displayName === 'PopperArrow'
    ) {
      arrowElement = React.cloneElement(child, {
        // @ts-ignore
        arrowProps,
        actualPlacement: placement,
      })
    } else {
      restElements.push(child)
    }
  })

  let arrowHeight = 0
  let arrowWidth = 0

  if (arrowElement) {
    arrowHeight = defaultArrowHeight
    arrowWidth = defaultArrowWidth
    //@ts-ignore
    if (arrowElement.props.height) {
      //@ts-ignore
      arrowHeight = arrowElement.props.height
    }
    //@ts-ignore
    if (arrowElement.props.width) {
      //@ts-ignore
      arrowWidth = arrowElement.props.width
    }
  }

  const containerStyle = React.useMemo(
    () =>
      getContainerStyle({
        placement,
        arrowHeight,
        arrowWidth,
      }),
    [arrowHeight, arrowWidth, placement]
  )

  // TODO move this over to snack views
  const overlayStyle = React.useMemo(
    () =>
      StyleSheet.create({
        overlay: {
          ...overlayProps.style,
          // To handle translucent android StatusBar
          // marginTop: Platform.select({ android: top, default: 0 }),
          opacity: rendered ? 1 : 0,
          position: 'absolute',
        },
      }),
    [rendered, overlayProps.style]
  )

  return (
    <View ref={overlayRef} collapsable={false} style={overlayStyle.overlay}>
      {arrowElement}
      <View style={StyleSheet.flatten([containerStyle, style])} {...rest} ref={ref}>
        {restElements}
      </View>
    </View>
  )
})

// This is an internal implementation of PopoverArrow
export type PopperArrowProps = StackProps

// TODO fix types
const PopperArrow = React.forwardRef(
  (
    {
      height = defaultArrowHeight,
      width = defaultArrowWidth,

      //@ts-ignore - Will be passed by React.cloneElement from PopperContent
      arrowProps = {},
      //@ts-ignore - Will be passed by React.cloneElement from PopperContent
      actualPlacement,
      style,
      borderColor = '#52525b',
      backgroundColor = 'black',
      ...rest
    }: PopperArrowProps,
    ref: any
  ) => {
    const additionalStyles = React.useMemo(
      // @ts-ignore
      () => getArrowStyles({ placement: actualPlacement, height, width }),
      [actualPlacement, height, width]
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
      () => [arrowProps.style, triangleStyle, additionalStyles, style],
      // @ts-ignore
      [triangleStyle, additionalStyles, arrowProps.style, style]
    )

    return (
      // @ts-ignore TODO
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

const getContainerStyle = ({ placement, arrowHeight }: IScrollContentStyle) => {
  const diagonalLength = getDiagonalLength(arrowHeight, arrowHeight) / 2
  if (placement === 'top') {
    return { marginBottom: diagonalLength }
  }
  if (placement === 'bottom') {
    return { marginTop: diagonalLength }
  }
  if (placement === 'left') {
    return { marginRight: diagonalLength }
  }
  if (placement === 'right') {
    return { marginLeft: diagonalLength }
  }
  return {}
}

PopperArrow.displayName = 'PopperArrow'
Popper.Content = PopperContent
Popper.Arrow = PopperArrow
