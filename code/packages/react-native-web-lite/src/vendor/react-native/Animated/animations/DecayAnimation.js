/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

'use strict';

import { Animation } from './Animation';

import {shouldUseNativeDriver} from '../NativeAnimatedHelper';



class DecayAnimation extends Animation {
  _startTime;
  _lastValue;
  _fromValue;
  _deceleration;
  _velocity;
  _onUpdate;
  _animationFrame;
  _useNativeDriver;

  constructor(config) {
    super();
    this._deceleration = config.deceleration ?? 0.998;
    this._velocity = config.velocity;
    this._useNativeDriver = shouldUseNativeDriver(config);
    this.__isInteraction = config.isInteraction ?? !this._useNativeDriver;
    this.__iterations = config.iterations ?? 1;
  }

  __getNativeAnimationConfig() {
    return {
      type: 'decay',
      deceleration: this._deceleration,
      velocity: this._velocity,
      iterations: this.__iterations,
    };
  }

  start(
    fromValue,
    onUpdate,
    onEnd,
    previousAnimation,
    animatedValue,
  ) {
    this.__active = true;
    this._lastValue = fromValue;
    this._fromValue = fromValue;
    this._onUpdate = onUpdate;
    this.__onEnd = onEnd;
    this._startTime = Date.now();
    if (this._useNativeDriver) {
      this.__startNativeAnimation(animatedValue);
    } else {
      this._animationFrame = requestAnimationFrame(this.onUpdate.bind(this));
    }
  }

  onUpdate() {
    const now = Date.now();

    const value =
      this._fromValue +
      (this._velocity / (1 - this._deceleration)) *
        (1 - Math.exp(-(1 - this._deceleration) * (now - this._startTime)));

    this._onUpdate(value);

    if (Math.abs(this._lastValue - value) < 0.1) {
      this.__debouncedOnEnd({finished: true});
      return;
    }

    this._lastValue = value;
    if (this.__active) {
      this._animationFrame = requestAnimationFrame(this.onUpdate.bind(this));
    }
  }

  stop() {
    super.stop();
    this.__active = false;
    global.cancelAnimationFrame(this._animationFrame);
    this.__debouncedOnEnd({finished: false});
  }
}

export { DecayAnimation }
export default DecayAnimation;
