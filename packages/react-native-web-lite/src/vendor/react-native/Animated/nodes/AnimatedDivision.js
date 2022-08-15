/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 * @format
 */
'use strict';

import AnimatedInterpolation from './AnimatedInterpolation';
import AnimatedNode from './AnimatedNode';
import AnimatedValue from './AnimatedValue';
import AnimatedWithChildren from './AnimatedWithChildren';

class AnimatedDivision extends AnimatedWithChildren {
  constructor(a, b) {
    super();
    this._warnedAboutDivideByZero = false;

    if (b === 0 || b instanceof AnimatedNode && b.__getValue() === 0) {
      console.error('Detected potential division by zero in AnimatedDivision');
    }

    this._a = typeof a === 'number' ? new AnimatedValue(a) : a;
    this._b = typeof b === 'number' ? new AnimatedValue(b) : b;
  }

  __makeNative() {
    this._a.__makeNative();

    this._b.__makeNative();

    super.__makeNative();
  }

  __getValue() {
    var a = this._a.__getValue();

    var b = this._b.__getValue();

    if (b === 0) {
      // Prevent spamming the console/LogBox
      if (!this._warnedAboutDivideByZero) {
        console.error('Detected division by zero in AnimatedDivision');
        this._warnedAboutDivideByZero = true;
      } // Passing infinity/NaN to Fabric will cause a native crash


      return 0;
    }

    this._warnedAboutDivideByZero = false;
    return a / b;
  }

  interpolate(config) {
    return new AnimatedInterpolation(this, config);
  }

  __attach() {
    this._a.__addChild(this);

    this._b.__addChild(this);
  }

  __detach() {
    this._a.__removeChild(this);

    this._b.__removeChild(this);

    super.__detach();
  }

  __getNativeConfig() {
    return {
      type: 'division',
      input: [this._a.__getNativeTag(), this._b.__getNativeTag()]
    };
  }

}

export default AnimatedDivision;