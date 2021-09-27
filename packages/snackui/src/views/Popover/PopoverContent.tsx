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

import React, { useEffect } from 'react'
import { Platform } from 'react-native'

import { useKeyboardDismissable } from '../../hooks/useKeyboardDismissable'
import { Popper } from '../Popper'
import { VStack } from '../Stacks'
import { PopoverContext } from './PopoverContext'
import type { IPopoverContentProps } from './types'

export const PopoverContent = React.forwardRef((props: IPopoverContentProps, ref: any) => {
  const {
    onClose,
    initialFocusRef,
    finalFocusRef,
    popoverContentId,
    headerMounted,
    bodyMounted,
    bodyId,
    headerId,
  } = React.useContext(PopoverContext)

  useEffect(() => {
    const finalFocusRefCurrentVal = finalFocusRef?.current
    if (initialFocusRef && initialFocusRef.current) {
      initialFocusRef.current.focus()
    }

    return () => {
      if (finalFocusRefCurrentVal) {
        finalFocusRefCurrentVal.focus()
      }
    }
  }, [finalFocusRef, initialFocusRef])

  useKeyboardDismissable({
    enabled: true,
    callback: onClose,
  })

  let arrowElement = null
  const restChildren: any = []
  React.Children.forEach(props.children, (child) => {
    if (child.type.displayName === 'PopperArrow') {
      arrowElement = child
    } else {
      restChildren.push(child)
    }
  })

  const accessibilityProps =
    Platform.OS === 'web'
      ? ({
          accessibilityRole: 'dialog',
          'aria-labelledby': headerMounted ? headerId : undefined,
          'aria-describedby': bodyMounted ? bodyId : undefined,
        } as any)
      : {}

  return (
    <Popper.Content nativeID={popoverContentId} {...accessibilityProps} ref={ref}>
      <VStack {...props}>
        {arrowElement}
        {restChildren}
      </VStack>
    </Popper.Content>
  )
})

PopoverContent.displayName = 'PopoverContent'
