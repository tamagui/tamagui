/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import * as React from 'react'
import { useMemo, useRef } from 'react'
import { pick, useMergeRefs, usePressEvents } from '@tamagui/react-native-web-internals'

const forwardPropsList = {
  accessibilityDisabled: true,
  accessibilityLabel: true,
  accessibilityLiveRegion: true,
  accessibilityRole: true,
  accessibilityState: true,
  accessibilityValue: true,
  children: true,
  disabled: true,
  focusable: true,
  nativeID: true,
  onBlur: true,
  onFocus: true,
  onLayout: true,
  testID: true,
}

const pickProps = (props) => pick(props, forwardPropsList)

function TouchableWithoutFeedback(props, forwardedRef) {
  const {
    delayPressIn,
    delayPressOut,
    delayLongPress,
    disabled,
    focusable,
    onLongPress,
    onPress,
    onPressIn,
    onPressOut,
    rejectResponderTermination,
  } = props

  const hostRef = useRef(null)

  const pressConfig = useMemo(
    () => ({
      cancelable: !rejectResponderTermination,
      disabled,
      delayLongPress,
      delayPressStart: delayPressIn,
      delayPressEnd: delayPressOut,
      onLongPress,
      onPress,
      onPressStart: onPressIn,
      onPressEnd: onPressOut,
    }),
    [
      disabled,
      delayPressIn,
      delayPressOut,
      delayLongPress,
      onLongPress,
      onPress,
      onPressIn,
      onPressOut,
      rejectResponderTermination,
    ]
  )

  const pressEventHandlers = usePressEvents(hostRef, pressConfig)

  const element = React.Children.only(props.children)
  const children = [element.props.children]
  const supportedProps = pickProps(props)
  // @ts-ignore
  supportedProps.accessibilityDisabled = disabled
  // @ts-ignore
  supportedProps.focusable = !disabled && focusable !== false
  // @ts-ignore
  supportedProps.ref = useMergeRefs(forwardedRef, hostRef, element.ref)

  const elementProps = Object.assign(supportedProps, pressEventHandlers)

  return React.cloneElement(element, elementProps, ...children)
}

const MemoedTouchableWithoutFeedback = React.memo(
  React.forwardRef(TouchableWithoutFeedback)
)
MemoedTouchableWithoutFeedback.displayName = 'TouchableWithoutFeedback'

export default MemoedTouchableWithoutFeedback
