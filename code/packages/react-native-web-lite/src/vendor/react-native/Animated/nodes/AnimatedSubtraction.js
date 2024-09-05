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
import AnimatedValue from './AnimatedValue'
import AnimatedWithChildren from './AnimatedWithChildren'

class AnimatedSubtraction extends AnimatedWithChildren {
  constructor(a, b) {
    super()
    this._a = typeof a === 'number' ? new AnimatedValue(a) : a
    this._b = typeof b === 'number' ? new AnimatedValue(b) : b
  }

  __makeNative(platformConfig) {
    this._a.__makeNative(platformConfig)

    this._b.__makeNative(platformConfig)

    super.__makeNative(platformConfig)
  }

  __getValue() {
    return this._a.__getValue() - this._b.__getValue()
  }

  interpolate(config) {
    return new AnimatedInterpolation(this, config)
  }

  __attach() {
    this._a.__addChild(this)

    this._b.__addChild(this)
  }

  __detach() {
    this._a.__removeChild(this)

    this._b.__removeChild(this)

    super.__detach()
  }

  __getNativeConfig() {
    return {
      type: 'subtraction',
      input: [this._a.__getNativeTag(), this._b.__getNativeTag()],
    }
  }
}

export default AnimatedSubtraction
