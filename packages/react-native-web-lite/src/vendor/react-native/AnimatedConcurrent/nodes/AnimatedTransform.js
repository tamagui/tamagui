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

import NativeAnimatedHelper from '../NativeAnimatedHelper.js'
import AnimatedNode from './AnimatedNode.js'
import AnimatedWithChildren from './AnimatedWithChildren.js'

export default class AnimatedTransform extends AnimatedWithChildren {
  _transforms

  constructor(transforms) {
    super()
    this._transforms = transforms
  }

  __makeNative(platformConfig) {
    this._transforms.forEach((transform) => {
      for (const key in transform) {
        const value = transform[key]
        if (value instanceof AnimatedNode) {
          value.__makeNative(platformConfig)
        }
      }
    })
    super.__makeNative(platformConfig)
  }

  __getValue() {
    return this._get((animatedNode) => animatedNode.__getValue())
  }

  __getAnimatedValue() {
    return this._get((animatedNode) => animatedNode.__getAnimatedValue())
  }

  __attach() {
    this._transforms.forEach((transform) => {
      for (const key in transform) {
        const value = transform[key]
        if (value instanceof AnimatedNode) {
          value.__addChild(this)
        }
      }
    })
  }

  __detach() {
    this._transforms.forEach((transform) => {
      for (const key in transform) {
        const value = transform[key]
        if (value instanceof AnimatedNode) {
          value.__removeChild(this)
        }
      }
    })
    super.__detach()
  }

  __getNativeConfig() {
    const transConfigs = []

    this._transforms.forEach((transform) => {
      for (const key in transform) {
        const value = transform[key]
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

  _get(getter) {
    return this._transforms.map((transform) => {
      const result = {}
      for (const key in transform) {
        const value = transform[key]
        if (value instanceof AnimatedNode) {
          result[key] = getter(value)
        } else if (Array.isArray(value)) {
          result[key] = value.map((element) => {
            if (element instanceof AnimatedNode) {
              return getter(element)
            } else {
              return element
            }
          })
        } else if (typeof value === 'object') {
          result[key] = {}
          for (const [nestedKey, nestedValue] of Object.entries(value)) {
            if (nestedValue instanceof AnimatedNode) {
              result[key][nestedKey] = getter(nestedValue)
            } else {
              result[key][nestedKey] = nestedValue
            }
          }
        } else {
          result[key] = value
        }
      }
      return result
    })
  }
}
