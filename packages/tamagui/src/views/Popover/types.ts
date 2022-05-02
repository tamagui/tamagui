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

import { StackProps } from '@tamagui/core'
import type { MutableRefObject } from 'react'
import React from 'react'
import type { ColorValue, GestureResponderEvent } from 'react-native'

export type IPopoverArrowProps = {
  height?: number
  width?: number
  color?: ColorValue
}

export type IPopoverArrowImplProps = {
  placement?: string
  arrowProps: IArrowProps
  height: number
  width: number
} & IPopoverArrowProps

export type IArrowProps = {
  style: Object
}

export interface IPopoverProps {
  /**
   * If true, the popover will be opened by default
   */
  defaultOpen?: boolean
  /**
   * Whether the popover is opened. Useful for conrolling the open state
   */
  open?: boolean
  /**
   * Whether popover should trap focus.
   * @default true
   */
  trapFocus?: boolean
  /**
   * Whether the element should flip its orientation (e.g. top to bottom or left to right) when there is insufficient room for it to render completely.
   * @default true
   */
  shouldFlip?: boolean
  /**
   * The ref of element to receive focus when the popover opens.
   */
  initialFocusRef?: React.RefObject<any>
  /**
   * The ref of element to receive focus when the modal closes.
   */
  finalFocusRef?: React.RefObject<any>
  /**
   * Function that returns a React Element. This element will be used as a Trigger for the popover
   */
  trigger: (
    props: {
      ref: any
      onPress: (e?: GestureResponderEvent) => any
      [key: string]: any
    },
    state: { open: boolean }
  ) => JSX.Element
  /**
   * The additional offset applied along the cross axis between the element and its trigger element.
   */
  crossOffset?: number
  /**
   * The additional offset applied along the main axis between the element and its trigger element.
   */
  offset?: number
  /**
   * Determines whether menu content should overlap with the trigger
   * @default false
   */
  shouldOverlapWithTrigger?: boolean
  /**
   * Popover children
   */
  children: React.ReactNode | ((state: { open: boolean }) => React.ReactNode)
  /**
   * If true, the modal will close when Escape key is pressed
   * @default true
   */
  isKeyboardDismissable?: boolean
  /**
   * Popover placement
   * @default bottom
   */
  placement?:
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
  /**
   * This function will be invoked when popover is closed. It'll also be called when user attempts to close the popover via Escape key or backdrop press.
   */
  onClose?: () => void
  /**
   * This function will be invoked when popover is opened
   */
  onOpen?: () => void
  /**
   * This function will be invoked when popover is opened or closed
   */
  onChangeOpen?: (open: boolean) => void
}

export type IPopoverContentImpl = {
  arrowHeight: number
  arrowWidth: number
  placement?: string
  arrowProps: IArrowProps
  children: any
}

export type IPopoverImplProps = IPopoverProps & {
  triggerRef: any
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

export type IPopoverContentProps = StackProps

export type IPopoverComponentType = ((
  props: IPopoverProps & { ref?: MutableRefObject<any> }
) => JSX.Element & { ref?: MutableRefObject<any> }) & {
  Body: React.MemoExoticComponent<
    (props: StackProps & { ref?: MutableRefObject<any> }) => JSX.Element
  >
  Content: React.MemoExoticComponent<
    (props: IPopoverContentProps & { ref?: MutableRefObject<any> }) => JSX.Element
  >
  Arrow: React.MemoExoticComponent<
    (props: StackProps & { ref?: MutableRefObject<any> }) => JSX.Element
  >
}
