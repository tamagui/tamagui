// forked from NativeBase
// The MIT License (MIT)
// Copyright (c) 2021 GeekyAnts India Pvt Ltd

import { useOverlayPosition } from '@react-native-aria/overlays'
import { useLayoutEffect, useMemo } from 'react'
import React, { useContext, useEffect, useRef } from 'react'

import { YStack } from '../Stacks'
import { PopperArrow } from './PopperArrow'
import { PopperContext } from './PopperContext'
import { defaultArrowHeight, defaultArrowWidth, getDiagonalLength } from './shared'
import { IPopperProps } from './types'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export const Popper = ({
  children,
  ...props
}: IPopperProps & {
  triggerRef: any
  onClose: any
  setOverlayRef?: (overlayRef: any) => void
}) => {
  const pv = Object.values(props)
  const args = new Array(10).fill(undefined).map((_, i) => pv[i])
  return (
    <PopperContext.Provider value={useMemo(() => props, args)}>{children}</PopperContext.Provider>
  )
}

export const PopperContent = React.forwardRef((props: any, ref: any) => {
  const { children, style, ...rest } = props
  const context = useContext(PopperContext)
  if (!context) {
    throw new Error(`No <Popper /> above <Popper.Content />`)
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

  useLayoutEffect(() => {
    setOverlayRef?.(overlayRef)
  }, [overlayRef, setOverlayRef])

  // Might have performance impact if there are a lot of siblings!
  // Shouldn't be an issue with popovers since it would have at most 2. Arrow and Content.
  // todo move to more radix style proper context based system
  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement(child) &&
      // @ts-ignore
      child.type.displayName === 'PopperArrow'
    ) {
      arrowElement = React.cloneElement(child as any, {
        ...context,
        ...arrowProps,
        ...arrowStyle,
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
