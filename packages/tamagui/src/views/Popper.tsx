// forked from NativeBase
// The MIT License (MIT)
// Copyright (c) 2021 GeekyAnts India Pvt Ltd

import { useOverlayPosition } from '@react-native-aria/overlays'
import type { ReactElement, RefObject } from 'react'
import React, { createContext, useContext, useEffect, useRef } from 'react'

import { PopperArrow } from './PopperArrow'
import { YStack } from './Stacks'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

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

export const defaultArrowHeight = 15
export const defaultArrowWidth = 15

export const getDiagonalLength = (height: number, width: number) => {
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

export const PopperContent = React.forwardRef((props: any, ref: any) => {
  const { children, style, ...rest } = props
  const context = useContext(PopperContext)
  if (!context) {
    throw new Error(`No PopperContext`)
  }
  const { setOverlayRef, triggerRef, ...restContext } = context
  const overlayRef = useRef(null)
  // const { top } = useSafeAreaInsets()
  const overlayPosition = useOverlayPosition({
    targetRef: triggerRef,
    overlayRef,
    isOpen: true,
    containerPadding: 0,
    ...restContext,
  })

  const {
    overlayProps: { style: overlayStyle, ...overlayProps },
    arrowProps: { style: arrowStyle, ...arrowProps },
    rendered,
    placement,
  } = overlayPosition

  let restElements: React.ReactNode[] = []
  let arrowElement: React.ReactElement | null = null

  useEffect(() => {
    setOverlayRef?.(overlayRef)
  }, [overlayRef, setOverlayRef])

  // Might have performance impact if there are a lot of siblings!
  // Shouldn't be an issue with popovers since it would have atmost 2. Arrow and Content.
  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement(child) &&
      // @ts-ignore
      child.type.displayName === 'PopperArrow'
    ) {
      // omit children
      const { children, ...restContext } = context
      arrowElement = React.cloneElement(child, {
        ...restContext,
        ...arrowProps,
        ...arrowStyle,
        // @ts-ignore
        placement,
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

  const diagonalLength = getDiagonalLength(arrowHeight, arrowWidth) / 2

  return (
    <YStack
      ref={overlayRef}
      collapsable={false}
      // To handle translucent android StatusBar
      opacity={rendered ? 1 : 0}
      position="absolute"
      {...overlayProps}
      {...overlayStyle}
    >
      {arrowElement}
      <YStack
        ref={ref}
        {...(placement === 'top' && {
          y: -diagonalLength,
        })}
        {...(placement === 'bottom' && {
          y: diagonalLength,
        })}
        {...(placement === 'left' && {
          x: -diagonalLength,
        })}
        {...(placement === 'right' && {
          x: diagonalLength,
        })}
        {...rest}
      >
        {restElements}
      </YStack>
    </YStack>
  )
})

Popper.Content = PopperContent
Popper.Arrow = PopperArrow
