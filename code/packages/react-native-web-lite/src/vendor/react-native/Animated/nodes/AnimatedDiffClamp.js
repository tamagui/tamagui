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

import AnimatedInterpolation from './AnimatedInterpolation'
import AnimatedWithChildren from './AnimatedWithChildren'

class AnimatedDiffClamp extends AnimatedWithChildren {
  constructor(a, min, max) {
    super()
    this._a = a
    this._min = min
    this._max = max
    this._value = this._lastValue = this._a.__getValue()
  }

  __makeNative(platformConfig) {
    this._a.__makeNative(platformConfig)

    super.__makeNative(platformConfig)
  }

  interpolate(config) {
    return new AnimatedInterpolation(this, config)
  }

  __getValue() {
    var value = this._a.__getValue()

    var diff = value - this._lastValue
    this._lastValue = value
    this._value = Math.min(Math.max(this._value + diff, this._min), this._max)
    return this._value
  }

  __attach() {
    this._a.__addChild(this)
  }

  __detach() {
    this._a.__removeChild(this)

    super.__detach()
  }

  __getNativeConfig() {
    return {
      type: 'diffclamp',
      input: this._a.__getNativeTag(),
      min: this._min,
      max: this._max,
    }
  }
}

export default AnimatedDiffClamp
