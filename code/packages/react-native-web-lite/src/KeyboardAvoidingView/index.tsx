/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import * as React from 'react'

import type { LayoutEvent, LayoutValue } from '../types'
import type { ViewProps } from '../View/index'
import View from '../View/index'

type KeyboardAvoidingViewProps = ViewProps & {
  behavior?: 'height' | 'padding' | 'position'
  contentContainerStyle?: ViewProps['style']
  keyboardVerticalOffset: number
}

class KeyboardAvoidingView extends React.Component<KeyboardAvoidingViewProps> {
  frame: LayoutValue | null = null

  relativeKeyboardHeight(keyboardFrame: Record<string, any>): number {
    const frame = this.frame
    if (!frame || !keyboardFrame) {
      return 0
    }
    const keyboardY = keyboardFrame.screenY - (this.props.keyboardVerticalOffset || 0)
    return Math.max(frame.y + frame.height - keyboardY, 0)
  }

  onKeyboardChange(event: Object) {}

  onLayout: (event: LayoutEvent) => void = (event: LayoutEvent) => {
    this.frame = event.nativeEvent.layout
  }

  render(): React.ReactNode {
    const {
      /* eslint-disable */
      behavior,
      contentContainerStyle,
      keyboardVerticalOffset,
      /* eslint-enable */
      ...rest
    } = this.props

    return <View onLayout={this.onLayout} {...rest} />
  }
}

export default KeyboardAvoidingView
