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

import { invariant } from '@tamagui/react-native-web-internals'

import AnimatedValue from './AnimatedValue'
import AnimatedWithChildren from './AnimatedWithChildren'
var _uniqueId = 1
/**
 * 2D Value for driving 2D animations, such as pan gestures. Almost identical
 * API to normal `Animated.Value`, but multiplexed.
 *
 * See https://reactnative.dev/docs/animatedvaluexy.html
 */

class AnimatedValueXY extends AnimatedWithChildren {
  constructor(valueIn) {
    super()
    var value = valueIn || {
      x: 0,
      y: 0,
    } // fixme: shouldn't need `: any`

    if (typeof value.x === 'number' && typeof value.y === 'number') {
      this.x = new AnimatedValue(value.x)
      this.y = new AnimatedValue(value.y)
    } else {
      invariant(
        value.x instanceof AnimatedValue && value.y instanceof AnimatedValue,
        'AnimatedValueXY must be initialized with an object of numbers or ' +
          'AnimatedValues.'
      )
      this.x = value.x
      this.y = value.y
    }

    this._listeners = {}
  }
  /**
   * Directly set the value. This will stop any animations running on the value
   * and update all the bound properties.
   *
   * See https://reactnative.dev/docs/animatedvaluexy.html#setvalue
   */

  setValue(value) {
    this.x.setValue(value.x)
    this.y.setValue(value.y)
  }
  /**
   * Sets an offset that is applied on top of whatever value is set, whether
   * via `setValue`, an animation, or `Animated.event`. Useful for compensating
   * things like the start of a pan gesture.
   *
   * See https://reactnative.dev/docs/animatedvaluexy.html#setoffset
   */

  setOffset(offset) {
    this.x.setOffset(offset.x)
    this.y.setOffset(offset.y)
  }
  /**
   * Merges the offset value into the base value and resets the offset to zero.
   * The final output of the value is unchanged.
   *
   * See https://reactnative.dev/docs/animatedvaluexy.html#flattenoffset
   */

  flattenOffset() {
    this.x.flattenOffset()
    this.y.flattenOffset()
  }
  /**
   * Sets the offset value to the base value, and resets the base value to
   * zero. The final output of the value is unchanged.
   *
   * See https://reactnative.dev/docs/animatedvaluexy.html#extractoffset
   */

  extractOffset() {
    this.x.extractOffset()
    this.y.extractOffset()
  }

  __getValue() {
    return {
      x: this.x.__getValue(),
      y: this.y.__getValue(),
    }
  }
  /**
   * Stops any animation and resets the value to its original.
   *
   * See https://reactnative.dev/docs/animatedvaluexy.html#resetanimation
   */

  resetAnimation(callback) {
    this.x.resetAnimation()
    this.y.resetAnimation()
    callback && callback(this.__getValue())
  }
  /**
   * Stops any running animation or tracking. `callback` is invoked with the
   * final value after stopping the animation, which is useful for updating
   * state to match the animation position with layout.
   *
   * See https://reactnative.dev/docs/animatedvaluexy.html#stopanimation
   */

  stopAnimation(callback) {
    this.x.stopAnimation()
    this.y.stopAnimation()
    callback && callback(this.__getValue())
  }
  /**
   * Adds an asynchronous listener to the value so you can observe updates from
   * animations.  This is useful because there is no way to synchronously read
   * the value because it might be driven natively.
   *
   * Returns a string that serves as an identifier for the listener.
   *
   * See https://reactnative.dev/docs/animatedvaluexy.html#addlistener
   */

  addListener(callback) {
    var id = String(_uniqueId++)

    var jointCallback = (_ref) => {
      var number = _ref.value
      callback(this.__getValue())
    }

    this._listeners[id] = {
      x: this.x.addListener(jointCallback),
      y: this.y.addListener(jointCallback),
    }
    return id
  }
  /**
   * Unregister a listener. The `id` param shall match the identifier
   * previously returned by `addListener()`.
   *
   * See https://reactnative.dev/docs/animatedvaluexy.html#removelistener
   */

  removeListener(id) {
    this.x.removeListener(this._listeners[id].x)
    this.y.removeListener(this._listeners[id].y)
    delete this._listeners[id]
  }
  /**
   * Remove all registered listeners.
   *
   * See https://reactnative.dev/docs/animatedvaluexy.html#removealllisteners
   */

  removeAllListeners() {
    this.x.removeAllListeners()
    this.y.removeAllListeners()
    this._listeners = {}
  }
  /**
   * Converts `{x, y}` into `{left, top}` for use in style.
   *
   * See https://reactnative.dev/docs/animatedvaluexy.html#getlayout
   */

  getLayout() {
    return {
      left: this.x,
      top: this.y,
    }
  }
  /**
   * Converts `{x, y}` into a useable translation transform.
   *
   * See https://reactnative.dev/docs/animatedvaluexy.html#gettranslatetransform
   */

  getTranslateTransform() {
    return [
      {
        translateX: this.x,
      },
      {
        translateY: this.y,
      },
    ]
  }
}

export default AnimatedValueXY
