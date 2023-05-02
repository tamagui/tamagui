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

import Easing from '../Easing'
import { shouldUseNativeDriver } from '../NativeAnimatedHelper'
import Animation from './Animation'

var _easeInOut

function easeInOut() {
  if (!_easeInOut) {
    _easeInOut = Easing.inOut(Easing.ease)
  }

  return _easeInOut
}

class TimingAnimation extends Animation {
  constructor(config) {
    var _config$easing,
      _config$duration,
      _config$delay,
      _config$iterations,
      _config$isInteraction

    super()
    this._toValue = config.toValue
    this._easing =
      (_config$easing = config.easing) !== null && _config$easing !== void 0
        ? _config$easing
        : easeInOut()
    this._duration =
      (_config$duration = config.duration) !== null && _config$duration !== void 0
        ? _config$duration
        : 500
    this._delay =
      (_config$delay = config.delay) !== null && _config$delay !== void 0
        ? _config$delay
        : 0
    this.__iterations =
      (_config$iterations = config.iterations) !== null && _config$iterations !== void 0
        ? _config$iterations
        : 1
    this._useNativeDriver = shouldUseNativeDriver(config)
    this._platformConfig = config.platformConfig
    this.__isInteraction =
      (_config$isInteraction = config.isInteraction) !== null &&
      _config$isInteraction !== void 0
        ? _config$isInteraction
        : !this._useNativeDriver
  }

  __getNativeAnimationConfig() {
    var frameDuration = 1000.0 / 60.0
    var frames = []
    var numFrames = Math.round(this._duration / frameDuration)

    for (var frame = 0; frame < numFrames; frame++) {
      frames.push(this._easing(frame / numFrames))
    }

    frames.push(this._easing(1))
    return {
      type: 'frames',
      frames,
      toValue: this._toValue,
      iterations: this.__iterations,
      platformConfig: this._platformConfig,
    }
  }

  start(fromValue, onUpdate, onEnd, previousAnimation, animatedValue) {
    this.__active = true
    this._fromValue = fromValue
    this._onUpdate = onUpdate
    this.__onEnd = onEnd

    var start = () => {
      // Animations that sometimes have 0 duration and sometimes do not
      // still need to use the native driver when duration is 0 so as to
      // not cause intermixed JS and native animations.
      if (this._duration === 0 && !this._useNativeDriver) {
        this._onUpdate(this._toValue)

        this.__debouncedOnEnd({
          finished: true,
        })
      } else {
        this._startTime = Date.now()

        if (this._useNativeDriver) {
          this.__startNativeAnimation(animatedValue)
        } else {
          this._animationFrame = requestAnimationFrame(
            // $FlowFixMe[method-unbinding] added when improving typing for this parameters
            this.onUpdate.bind(this)
          )
        }
      }
    }

    if (this._delay) {
      this._timeout = setTimeout(start, this._delay)
    } else {
      start()
    }
  }

  onUpdate() {
    var now = Date.now()

    if (now >= this._startTime + this._duration) {
      if (this._duration === 0) {
        this._onUpdate(this._toValue)
      } else {
        this._onUpdate(
          this._fromValue + this._easing(1) * (this._toValue - this._fromValue)
        )
      }

      this.__debouncedOnEnd({
        finished: true,
      })

      return
    }

    this._onUpdate(
      this._fromValue +
        this._easing((now - this._startTime) / this._duration) *
          (this._toValue - this._fromValue)
    )

    if (this.__active) {
      // $FlowFixMe[method-unbinding] added when improving typing for this parameters
      this._animationFrame = requestAnimationFrame(this.onUpdate.bind(this))
    }
  }

  stop() {
    super.stop()
    this.__active = false
    clearTimeout(this._timeout)
    global.cancelAnimationFrame(this._animationFrame)

    this.__debouncedOnEnd({
      finished: false,
    })
  }
}

export default TimingAnimation
