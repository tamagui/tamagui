/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
'use strict'

import { StyleSheet } from '@tamagui/react-native-web-internals'

import NativeAnimatedHelper from '../NativeAnimatedHelper'
import AnimatedNode from './AnimatedNode'
import AnimatedTransform from './AnimatedTransform'
import AnimatedWithChildren from './AnimatedWithChildren'

var flattenStyle = StyleSheet.flatten

function createAnimatedStyle(inputStyle) {
  var style = flattenStyle(inputStyle)
  var animatedStyles = {}

  for (var key in style) {
    var value = style[key]

    if (key === 'transform') {
      animatedStyles[key] = new AnimatedTransform(value)
    } else if (value instanceof AnimatedNode) {
      animatedStyles[key] = value
    } else if (value && !Array.isArray(value) && typeof value === 'object') {
      animatedStyles[key] = createAnimatedStyle(value)
    }
  }

  return animatedStyles
}

class AnimatedStyle extends AnimatedWithChildren {
  constructor(style) {
    super()
    this._inputStyle = style
    this._style = createAnimatedStyle(style)
  } // Recursively get values for nested styles (like iOS's shadowOffset)

  _walkStyleAndGetValues(style) {
    var updatedStyle = {}

    for (var key in style) {
      var value = style[key]

      if (value instanceof AnimatedNode) {
        if (!value.__isNative) {
          // We cannot use value of natively driven nodes this way as the value we have access from
          // JS may not be up to date.
          updatedStyle[key] = value.__getValue()
        }
      } else if (value && !Array.isArray(value) && typeof value === 'object') {
        // Support animating nested values (for example: shadowOffset.height)
        updatedStyle[key] = this._walkStyleAndGetValues(value)
      } else {
        updatedStyle[key] = value
      }
    }

    return updatedStyle
  }

  __getValue() {
    return [this._inputStyle, this._walkStyleAndGetValues(this._style)]
  } // Recursively get animated values for nested styles (like iOS's shadowOffset)

  _walkStyleAndGetAnimatedValues(style) {
    var updatedStyle = {}

    for (var key in style) {
      var value = style[key]

      if (value instanceof AnimatedNode) {
        updatedStyle[key] = value.__getAnimatedValue()
      } else if (value && !Array.isArray(value) && typeof value === 'object') {
        // Support animating nested values (for example: shadowOffset.height)
        updatedStyle[key] = this._walkStyleAndGetAnimatedValues(value)
      }
    }

    return updatedStyle
  }

  __getAnimatedValue() {
    return this._walkStyleAndGetAnimatedValues(this._style)
  }

  __attach() {
    for (var key in this._style) {
      var value = this._style[key]

      if (value instanceof AnimatedNode) {
        value.__addChild(this)
      }
    }
  }

  __detach() {
    for (var key in this._style) {
      var value = this._style[key]

      if (value instanceof AnimatedNode) {
        value.__removeChild(this)
      }
    }

    super.__detach()
  }

  __makeNative() {
    for (var key in this._style) {
      var value = this._style[key]

      if (value instanceof AnimatedNode) {
        value.__makeNative()
      }
    }

    super.__makeNative()
  }

  __getNativeConfig() {
    var styleConfig = {}

    for (var styleKey in this._style) {
      if (this._style[styleKey] instanceof AnimatedNode) {
        var style = this._style[styleKey]

        style.__makeNative()

        styleConfig[styleKey] = style.__getNativeTag()
      }
    }

    NativeAnimatedHelper.validateStyles(styleConfig)
    return {
      type: 'style',
      style: styleConfig,
    }
  }
}

export default AnimatedStyle
