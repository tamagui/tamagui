

import AnimatedInterpolation from './AnimatedInterpolation'
import AnimatedNode from './AnimatedNode'
import AnimatedValue from './AnimatedValue'
import AnimatedWithChildren from './AnimatedWithChildren'

class AnimatedDivision extends AnimatedWithChildren {
  constructor(a, b) {
    super()
    this._warnedAboutDivideByZero = false

    if (b === 0 || (b instanceof AnimatedNode && b.__getValue() === 0)) {
      console.error('Detected potential division by zero in AnimatedDivision')
    }

    this._a = typeof a === 'number' ? new AnimatedValue(a) : a
    this._b = typeof b === 'number' ? new AnimatedValue(b) : b
  }

  __makeNative(platformConfig) {
    this._a.__makeNative(platformConfig)

    this._b.__makeNative(platformConfig)

    super.__makeNative(platformConfig)
  }

  __getValue() {
    var a = this._a.__getValue()

    var b = this._b.__getValue()

    if (b === 0) {
      // Prevent spamming the console/LogBox
      if (!this._warnedAboutDivideByZero) {
        console.error('Detected division by zero in AnimatedDivision')
        this._warnedAboutDivideByZero = true
      } // Passing infinity/NaN to Fabric will cause a native crash

      return 0
    }

    this._warnedAboutDivideByZero = false
    return a / b
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
      type: 'division',
      input: [this._a.__getNativeTag(), this._b.__getNativeTag()],
    }
  }
}

export default AnimatedDivision
