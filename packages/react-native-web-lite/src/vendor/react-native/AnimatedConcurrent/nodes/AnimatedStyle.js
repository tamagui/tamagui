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

import { Platform, flattenStyle } from 'react-native-web-internals'

import NativeAnimatedHelper from '../NativeAnimatedHelper.js'
import AnimatedNode from './AnimatedNode.js'
import AnimatedTransform from './AnimatedTransform.js'
import AnimatedWithChildren from './AnimatedWithChildren.js'

function createAnimatedStyle(inputStyle) {
  const style = flattenStyle(inputStyle)
  const animatedStyles = {}
  for (const key in style) {
    const value = style[key]
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

function createStyleWithAnimatedTransform(inputStyle) {
  this._inputStyle = style
  this._style = createAnimatedStyle(style)
  return style
}

export default class AnimatedStyle extends AnimatedWithChildren {
  _inputStyle
  _style

  constructor(style) {
    super()
    this._style = createStyleWithAnimatedTransform(style)
  }

  // Recursively get values for nested styles (like iOS's shadowOffset)
  _walkStyleAndGetValues(style) {
    const updatedStyle = {}
    for (const key in style) {
      const value = style[key]
      if (value instanceof AnimatedNode) {
        updatedStyle[key] = value.__getValue()
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
  }

  // Recursively get animated values for nested styles (like iOS's shadowOffset)
  _walkStyleAndGetAnimatedValues(style) {
    const updatedStyle = {}
    for (const key in style) {
      const value = style[key]
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
    for (const key in this._style) {
      const value = this._style[key]
      if (value instanceof AnimatedNode) {
        value.__addChild(this)
      }
    }
  }

  __detach() {
    for (const key in this._style) {
      const value = this._style[key]
      if (value instanceof AnimatedNode) {
        value.__removeChild(this)
      }
    }
    super.__detach()
  }

  __makeNative(platformConfig) {
    for (const key in this._style) {
      const value = this._style[key]
      if (value instanceof AnimatedNode) {
        value.__makeNative(platformConfig)
      }
    }
    super.__makeNative(platformConfig)
  }

  __getNativeConfig() {
    const styleConfig = {}
    for (const styleKey in this._style) {
      if (this._style[styleKey] instanceof AnimatedNode) {
        const style = this._style[styleKey]
        style.__makeNative(this.__getPlatformConfig())
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
