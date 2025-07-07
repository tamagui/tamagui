/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

'use strict'

import AnimatedInterpolation from './AnimatedInterpolation'
import AnimatedWithChildren from './AnimatedWithChildren'
import { InteractionManager } from '@tamagui/react-native-web-internals'
import NativeAnimatedHelper from '../NativeAnimatedHelper'

const NativeAnimatedAPI = NativeAnimatedHelper.API

/**
 * Animated works by building a directed acyclic graph of dependencies
 * transparently when you render your Animated components.
 *
 *               new Animated.Value(0)
 *     .interpolate()        .interpolate()    new Animated.Value(1)
 *         opacity               translateY      scale
 *          style                         transform
 *         View#234                         style
 *                                         View#123
 *
 * A) Top Down phase
 * When an Animated.Value is updated, we recursively go down through this
 * graph in order to find leaf nodes: the views that we flag as needing
 * an update.
 *
 * B) Bottom Up phase
 * When a view is flagged as needing an update, we recursively go back up
 * in order to build the new value that it needs. The reason why we need
 * this two-phases process is to deal with composite props such as
 * transform which can receive values from multiple parents.
 */
function _flush(rootNode) {
  const animatedStyles = new Set()
  function findAnimatedStyles(node) {
    /* $FlowFixMe[prop-missing] (>=0.68.0 site=react_native_fb) This comment
     * suppresses an error found when Flow v0.68 was deployed. To see the error
     * delete this comment and run Flow. */
    if (typeof node.update === 'function') {
      animatedStyles.add(node)
    } else {
      node.__getChildren().forEach(findAnimatedStyles)
    }
  }
  findAnimatedStyles(rootNode)
  // $FlowFixMe[prop-missing]
  animatedStyles.forEach((animatedStyle) => animatedStyle.update())
}

/**
 * Some operations are executed only on batch end, which is _mostly_ scheduled when
 * Animated component props change. For some of the changes which require immediate execution
 * (e.g. setValue), we create a separate batch in case none is scheduled.
 */
function _executeAsAnimatedBatch(id, operation) {
  NativeAnimatedAPI.setWaitingForIdentifier(id)
  operation()
  NativeAnimatedAPI.unsetWaitingForIdentifier(id)
}

/**
 * Standard value for driving animations.  One `Animated.Value` can drive
 * multiple properties in a synchronized fashion, but can only be driven by one
 * mechanism at a time.  Using a new mechanism (e.g. starting a new animation,
 * or calling `setValue`) will stop any previous ones.
 *
 * See https://reactnative.dev/docs/animatedvalue
 */
class AnimatedValue extends AnimatedWithChildren {
  _value
  _startingValue
  _offset
  _animation
  _tracking

  constructor(value, config) {
    super()
    if (typeof value !== 'number') {
      throw new Error('AnimatedValue: Attempting to set value to undefined')
    }
    this._startingValue = this._value = value
    this._offset = 0
    this._animation = null
    if (config && config.useNativeDriver) {
      this.__makeNative()
    }
  }

  __detach() {
    if (this.__isNative) {
      NativeAnimatedAPI.getValue(this.__getNativeTag(), (value) => {
        this._value = value - this._offset
      })
    }
    this.stopAnimation()
    super.__detach()
  }

  __getValue() {
    return this._value + this._offset
  }

  /**
   * Directly set the value.  This will stop any animations running on the value
   * and update all the bound properties.
   *
   * See https://reactnative.dev/docs/animatedvalue#setvalue
   */
  setValue(value) {
    if (this._animation) {
      this._animation.stop()
      this._animation = null
    }
    this._updateValue(
      value,
      !this.__isNative /* don't perform a flush for natively driven values */
    )
    if (this.__isNative) {
      _executeAsAnimatedBatch(this.__getNativeTag().toString(), () =>
        NativeAnimatedAPI.setAnimatedNodeValue(this.__getNativeTag(), value)
      )
    }
  }

  /**
   * Sets an offset that is applied on top of whatever value is set, whether via
   * `setValue`, an animation, or `Animated.event`.  Useful for compensating
   * things like the start of a pan gesture.
   *
   * See https://reactnative.dev/docs/animatedvalue#setoffset
   */
  setOffset(offset) {
    this._offset = offset
    if (this.__isNative) {
      NativeAnimatedAPI.setAnimatedNodeOffset(this.__getNativeTag(), offset)
    }
  }

  /**
   * Merges the offset value into the base value and resets the offset to zero.
   * The final output of the value is unchanged.
   *
   * See https://reactnative.dev/docs/animatedvalue#flattenoffset
   */
  flattenOffset() {
    this._value += this._offset
    this._offset = 0
    if (this.__isNative) {
      NativeAnimatedAPI.flattenAnimatedNodeOffset(this.__getNativeTag())
    }
  }

  /**
   * Sets the offset value to the base value, and resets the base value to zero.
   * The final output of the value is unchanged.
   *
   * See https://reactnative.dev/docs/animatedvalue#extractoffset
   */
  extractOffset() {
    this._offset += this._value
    this._value = 0
    if (this.__isNative) {
      NativeAnimatedAPI.extractAnimatedNodeOffset(this.__getNativeTag())
    }
  }

  /**
   * Stops any running animation or tracking. `callback` is invoked with the
   * final value after stopping the animation, which is useful for updating
   * state to match the animation position with layout.
   *
   * See https://reactnative.dev/docs/animatedvalue#stopanimation
   */
  stopAnimation(callback) {
    this.stopTracking()
    this._animation && this._animation.stop()
    this._animation = null
    if (callback) {
      if (this.__isNative) {
        NativeAnimatedAPI.getValue(this.__getNativeTag(), callback)
      } else {
        callback(this.__getValue())
      }
    }
  }

  /**
   * Stops any animation and resets the value to its original.
   *
   * See https://reactnative.dev/docs/animatedvalue#resetanimation
   */
  resetAnimation(callback) {
    this.stopAnimation(callback)
    this._value = this._startingValue
    if (this.__isNative) {
      NativeAnimatedAPI.setAnimatedNodeValue(this.__getNativeTag(), this._startingValue)
    }
  }

  __onAnimatedValueUpdateReceived(value) {
    this._updateValue(value, false /*flush*/)
  }

  /**
   * Interpolates the value before updating the property, e.g. mapping 0-1 to
   * 0-10.
   */
  interpolate(config) {
    return new AnimatedInterpolation(this, config)
  }

  /**
   * Typically only used internally, but could be used by a custom Animation
   * class.
   *
   * See https://reactnative.dev/docs/animatedvalue#animate
   */
  animate(animation, callback) {
    let handle = null
    if (animation.__isInteraction) {
      handle = InteractionManager.createInteractionHandle()
    }
    const previousAnimation = this._animation
    this._animation && this._animation.stop()
    this._animation = animation
    animation.start(
      this._value,
      (value) => {
        // Natively driven animations will never call into that callback
        this._updateValue(value, true /* flush */)
      },
      (result) => {
        this._animation = null
        if (handle !== null) {
          InteractionManager.clearInteractionHandle(handle)
        }
        callback && callback(result)
      },
      previousAnimation,
      this
    )
  }

  /**
   * Typically only used internally.
   */
  stopTracking() {
    this._tracking && this._tracking.__detach()
    this._tracking = null
  }

  /**
   * Typically only used internally.
   */
  track(tracking) {
    this.stopTracking()
    this._tracking = tracking
    // Make sure that the tracking animation starts executing
    this._tracking && this._tracking.update()
  }

  _updateValue(value, flush) {
    if (value === undefined) {
      throw new Error('AnimatedValue: Attempting to set value to undefined')
    }

    this._value = value
    if (flush) {
      _flush(this)
    }
    super.__callListeners(this.__getValue())
  }

  __getNativeConfig() {
    return {
      type: 'value',
      value: this._value,
      offset: this._offset,
    }
  }
}

export default AnimatedValue
