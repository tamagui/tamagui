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

class AnimatedModulo extends AnimatedWithChildren {
  constructor(a, modulus) {
    super()
    this._a = a
    this._modulus = modulus
  }

  __makeNative(platformConfig) {
    this._a.__makeNative(platformConfig)

    super.__makeNative(platformConfig)
  }

  __getValue() {
    return ((this._a.__getValue() % this._modulus) + this._modulus) % this._modulus
  }

  interpolate(config) {
    return new AnimatedInterpolation(this, config)
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
      type: 'modulus',
      input: this._a.__getNativeTag(),
      modulus: this._modulus,
    }
  }
}

export default AnimatedModulo
