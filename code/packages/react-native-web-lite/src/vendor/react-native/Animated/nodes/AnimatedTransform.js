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

import NativeAnimatedHelper from '../NativeAnimatedHelper'
import AnimatedNode from './AnimatedNode'
import AnimatedWithChildren from './AnimatedWithChildren'

class AnimatedTransform extends AnimatedWithChildren {
  constructor(transforms) {
    super()
    this._transforms = transforms || []
  }

  __makeNative() {
    this._transforms.forEach((transform) => {
      for (var key in transform) {
        var value = transform[key]

        if (value instanceof AnimatedNode) {
          value.__makeNative()
        }
      }
    })

    super.__makeNative()
  }

  __getValue() {
    return this._transforms.map((transform) => {
      var result = {}

      for (var key in transform) {
        var value = transform[key]

        if (value instanceof AnimatedNode) {
          result[key] = value.__getValue()
        } else {
          result[key] = value
        }
      }

      return result
    })
  }

  __getAnimatedValue() {
    return this._transforms.map((transform) => {
      var result = {}

      for (var key in transform) {
        var value = transform[key]

        if (value instanceof AnimatedNode) {
          result[key] = value.__getAnimatedValue()
        } else {
          // All transform components needed to recompose matrix
          result[key] = value
        }
      }

      return result
    })
  }

  __attach() {
    this._transforms.forEach((transform) => {
      for (var key in transform) {
        var value = transform[key]

        if (value instanceof AnimatedNode) {
          value.__addChild(this)
        }
      }
    })
  }

  __detach() {
    this._transforms.forEach((transform) => {
      for (var key in transform) {
        var value = transform[key]

        if (value instanceof AnimatedNode) {
          value.__removeChild(this)
        }
      }
    })

    super.__detach()
  }

  __getNativeConfig() {
    var transConfigs = []

    this._transforms.forEach((transform) => {
      for (var key in transform) {
        var value = transform[key]

        if (value instanceof AnimatedNode) {
          transConfigs.push({
            type: 'animated',
            property: key,
            nodeTag: value.__getNativeTag(),
          })
        } else {
          transConfigs.push({
            type: 'static',
            property: key,
            value: NativeAnimatedHelper.transformDataType(value),
          })
        }
      }
    })

    NativeAnimatedHelper.validateTransform(transConfigs)
    return {
      type: 'transform',
      transforms: transConfigs,
    }
  }
}

export default AnimatedTransform
