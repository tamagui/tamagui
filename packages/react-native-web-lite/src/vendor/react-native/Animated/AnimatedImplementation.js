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

import { AnimatedEvent, attachNativeEvent } from './AnimatedEvent'
import DecayAnimation from './animations/DecayAnimation'
import SpringAnimation from './animations/SpringAnimation'
import TimingAnimation from './animations/TimingAnimation'
import createAnimatedComponent from './createAnimatedComponent'
import AnimatedAddition from './nodes/AnimatedAddition'
import AnimatedColor from './nodes/AnimatedColor'
import AnimatedDiffClamp from './nodes/AnimatedDiffClamp'
import AnimatedDivision from './nodes/AnimatedDivision'
import AnimatedInterpolation from './nodes/AnimatedInterpolation'
import AnimatedModulo from './nodes/AnimatedModulo'
import AnimatedMultiplication from './nodes/AnimatedMultiplication'
import AnimatedNode from './nodes/AnimatedNode'
import AnimatedSubtraction from './nodes/AnimatedSubtraction'
import AnimatedTracking from './nodes/AnimatedTracking'
import AnimatedValue from './nodes/AnimatedValue'
import AnimatedValueXY from './nodes/AnimatedValueXY'

var add = function add(a, b) {
  return new AnimatedAddition(a, b)
}

var subtract = function subtract(a, b) {
  return new AnimatedSubtraction(a, b)
}

var divide = function divide(a, b) {
  return new AnimatedDivision(a, b)
}

var multiply = function multiply(a, b) {
  return new AnimatedMultiplication(a, b)
}

var modulo = function modulo(a, modulus) {
  return new AnimatedModulo(a, modulus)
}

var diffClamp = function diffClamp(a, min, max) {
  return new AnimatedDiffClamp(a, min, max)
}

var _combineCallbacks = function _combineCallbacks(callback, config) {
  if (callback && config.onComplete) {
    return function () {
      config.onComplete && config.onComplete(...arguments)
      callback && callback(...arguments)
    }
  } else {
    return callback || config.onComplete
  }
}

var maybeVectorAnim = function maybeVectorAnim(value, config, anim) {
  if (value instanceof AnimatedValueXY) {
    var configX = { ...config }

    var configY = { ...config }

    for (var key in config) {
      var _config$key = config[key],
        x = _config$key.x,
        y = _config$key.y

      if (x !== undefined && y !== undefined) {
        configX[key] = x
        configY[key] = y
      }
    }

    var aX = anim(value.x, configX)
    var aY = anim(value.y, configY) // We use `stopTogether: false` here because otherwise tracking will break
    // because the second animation will get stopped before it can update.

    return parallel([aX, aY], {
      stopTogether: false,
    })
  } else if (value instanceof AnimatedColor) {
    var configR = { ...config }

    var configG = { ...config }

    var configB = { ...config }

    var configA = { ...config }

    for (var _key in config) {
      var _config$_key = config[_key],
        r = _config$_key.r,
        g = _config$_key.g,
        b = _config$_key.b,
        a = _config$_key.a

      if (r !== undefined && g !== undefined && b !== undefined && a !== undefined) {
        configR[_key] = r
        configG[_key] = g
        configB[_key] = b
        configA[_key] = a
      }
    }

    var aR = anim(value.r, configR)
    var aG = anim(value.g, configG)
    var aB = anim(value.b, configB)
    var aA = anim(value.a, configA) // We use `stopTogether: false` here because otherwise tracking will break
    // because the second animation will get stopped before it can update.

    return parallel([aR, aG, aB, aA], {
      stopTogether: false,
    })
  }

  return null
}

var spring = function spring(value, config) {
  var _start = function start(animatedValue, configuration, callback) {
    callback = _combineCallbacks(callback, configuration)
    var singleValue = animatedValue
    var singleConfig = configuration
    singleValue.stopTracking()

    if (configuration.toValue instanceof AnimatedNode) {
      singleValue.track(
        new AnimatedTracking(
          singleValue,
          configuration.toValue,
          SpringAnimation,
          singleConfig,
          callback
        )
      )
    } else {
      singleValue.animate(new SpringAnimation(singleConfig), callback)
    }
  }

  return (
    maybeVectorAnim(value, config, spring) || {
      start: function start(callback) {
        _start(value, config, callback)
      },
      stop: function stop() {
        value.stopAnimation()
      },
      reset: function reset() {
        value.resetAnimation()
      },
      _startNativeLoop: function _startNativeLoop(iterations) {
        var singleConfig = {
          ...config,
          iterations,
        }

        _start(value, singleConfig)
      },
      _isUsingNativeDriver: function _isUsingNativeDriver() {
        return config.useNativeDriver || false
      },
    }
  )
}

var timing = function timing(value, config) {
  var _start2 = function start(animatedValue, configuration, callback) {
    callback = _combineCallbacks(callback, configuration)
    var singleValue = animatedValue
    var singleConfig = configuration
    singleValue.stopTracking()

    if (configuration.toValue instanceof AnimatedNode) {
      singleValue.track(
        new AnimatedTracking(
          singleValue,
          configuration.toValue,
          TimingAnimation,
          singleConfig,
          callback
        )
      )
    } else {
      singleValue.animate(new TimingAnimation(singleConfig), callback)
    }
  }

  return (
    maybeVectorAnim(value, config, timing) || {
      start: function start(callback) {
        _start2(value, config, callback)
      },
      stop: function stop() {
        value.stopAnimation()
      },
      reset: function reset() {
        value.resetAnimation()
      },
      _startNativeLoop: function _startNativeLoop(iterations) {
        var singleConfig = {
          ...config,
          iterations,
        }

        _start2(value, singleConfig)
      },
      _isUsingNativeDriver: function _isUsingNativeDriver() {
        return config.useNativeDriver || false
      },
    }
  )
}

var decay = function decay(value, config) {
  var _start3 = function start(animatedValue, configuration, callback) {
    callback = _combineCallbacks(callback, configuration)
    var singleValue = animatedValue
    var singleConfig = configuration
    singleValue.stopTracking()
    singleValue.animate(new DecayAnimation(singleConfig), callback)
  }

  return (
    maybeVectorAnim(value, config, decay) || {
      start: function start(callback) {
        _start3(value, config, callback)
      },
      stop: function stop() {
        value.stopAnimation()
      },
      reset: function reset() {
        value.resetAnimation()
      },
      _startNativeLoop: function _startNativeLoop(iterations) {
        var singleConfig = {
          ...config,
          iterations,
        }

        _start3(value, singleConfig)
      },
      _isUsingNativeDriver: function _isUsingNativeDriver() {
        return config.useNativeDriver || false
      },
    }
  )
}

var sequence = function sequence(animations) {
  var current = 0
  return {
    start: function start(callback) {
      var onComplete = function onComplete(result) {
        if (!result.finished) {
          callback && callback(result)
          return
        }

        current++

        if (current === animations.length) {
          callback && callback(result)
          return
        }

        animations[current].start(onComplete)
      }

      if (animations.length === 0) {
        callback &&
          callback({
            finished: true,
          })
      } else {
        animations[current].start(onComplete)
      }
    },
    stop: function stop() {
      if (current < animations.length) {
        animations[current].stop()
      }
    },
    reset: function reset() {
      animations.forEach((animation, idx) => {
        if (idx <= current) {
          animation.reset()
        }
      })
      current = 0
    },
    _startNativeLoop: function _startNativeLoop() {
      throw new Error(
        'Loops run using the native driver cannot contain Animated.sequence animations'
      )
    },
    _isUsingNativeDriver: function _isUsingNativeDriver() {
      return false
    },
  }
}

var parallel = function parallel(animations, config) {
  var doneCount = 0 // Make sure we only call stop() at most once for each animation

  var hasEnded = {}
  var stopTogether = !(config && config.stopTogether === false)
  var result = {
    start: function start(callback) {
      if (doneCount === animations.length) {
        callback &&
          callback({
            finished: true,
          })
        return
      }

      animations.forEach((animation, idx) => {
        var cb = function cb(endResult) {
          hasEnded[idx] = true
          doneCount++

          if (doneCount === animations.length) {
            doneCount = 0
            callback && callback(endResult)
            return
          }

          if (!endResult.finished && stopTogether) {
            result.stop()
          }
        }

        if (!animation) {
          cb({
            finished: true,
          })
        } else {
          animation.start(cb)
        }
      })
    },
    stop: function stop() {
      animations.forEach((animation, idx) => {
        !hasEnded[idx] && animation.stop()
        hasEnded[idx] = true
      })
    },
    reset: function reset() {
      animations.forEach((animation, idx) => {
        animation.reset()
        hasEnded[idx] = false
        doneCount = 0
      })
    },
    _startNativeLoop: function _startNativeLoop() {
      throw new Error(
        'Loops run using the native driver cannot contain Animated.parallel animations'
      )
    },
    _isUsingNativeDriver: function _isUsingNativeDriver() {
      return false
    },
  }
  return result
}

var delay = function delay(time) {
  // Would be nice to make a specialized implementation
  return timing(new AnimatedValue(0), {
    toValue: 0,
    delay: time,
    duration: 0,
    useNativeDriver: false,
  })
}

var stagger = function stagger(time, animations) {
  return parallel(
    animations.map((animation, i) => {
      return sequence([delay(time * i), animation])
    })
  )
}

var loop = function loop(
  animation, // $FlowFixMe[prop-missing]
  _temp
) {
  var _ref = _temp === void 0 ? {} : _temp,
    _ref$iterations = _ref.iterations,
    iterations = _ref$iterations === void 0 ? -1 : _ref$iterations,
    _ref$resetBeforeItera = _ref.resetBeforeIteration,
    resetBeforeIteration = _ref$resetBeforeItera === void 0 ? true : _ref$resetBeforeItera

  var isFinished = false
  var iterationsSoFar = 0
  return {
    start: function start(callback) {
      var restart = function restart(result) {
        if (result === void 0) {
          result = {
            finished: true,
          }
        }

        if (isFinished || iterationsSoFar === iterations || result.finished === false) {
          callback && callback(result)
        } else {
          iterationsSoFar++
          resetBeforeIteration && animation.reset()
          animation.start(restart)
        }
      }

      if (!animation || iterations === 0) {
        callback &&
          callback({
            finished: true,
          })
      } else {
        if (animation._isUsingNativeDriver()) {
          animation._startNativeLoop(iterations)
        } else {
          restart() // Start looping recursively on the js thread
        }
      }
    },
    stop: function stop() {
      isFinished = true
      animation.stop()
    },
    reset: function reset() {
      iterationsSoFar = 0
      isFinished = false
      animation.reset()
    },
    _startNativeLoop: function _startNativeLoop() {
      throw new Error(
        'Loops run using the native driver cannot contain Animated.loop animations'
      )
    },
    _isUsingNativeDriver: function _isUsingNativeDriver() {
      return animation._isUsingNativeDriver()
    },
  }
}

function forkEvent(event, listener) {
  if (!event) {
    return listener
  } else if (event instanceof AnimatedEvent) {
    event.__addListener(listener)

    return event
  } else {
    return function () {
      typeof event === 'function' && event(...arguments)
      listener(...arguments)
    }
  }
}

function unforkEvent(event, listener) {
  if (event && event instanceof AnimatedEvent) {
    event.__removeListener(listener)
  }
}

var event = function event(argMapping, config) {
  var animatedEvent = new AnimatedEvent(argMapping, config)

  if (animatedEvent.__isNative) {
    return animatedEvent
  } else {
    return animatedEvent.__getHandler()
  }
} // All types of animated nodes that represent scalar numbers and can be interpolated (etc)

/**
 * The `Animated` library is designed to make animations fluid, powerful, and
 * easy to build and maintain. `Animated` focuses on declarative relationships
 * between inputs and outputs, with configurable transforms in between, and
 * simple `start`/`stop` methods to control time-based animation execution.
 * If additional transforms are added, be sure to include them in
 * AnimatedMock.js as well.
 *
 * See https://reactnative.dev/docs/animated
 */
export default {
  /**
   * Standard value class for driving animations.  Typically initialized with
   * `new Animated.Value(0);`
   *
   * See https://reactnative.dev/docs/animated#value
   */
  Value: AnimatedValue,

  /**
   * 2D value class for driving 2D animations, such as pan gestures.
   *
   * See https://reactnative.dev/docs/animatedvaluexy
   */
  ValueXY: AnimatedValueXY,

  /**
   * Value class for driving color animations.
   */
  Color: AnimatedColor,

  /**
   * Exported to use the Interpolation type in flow.
   *
   * See https://reactnative.dev/docs/animated#interpolation
   */
  Interpolation: AnimatedInterpolation,

  /**
   * Exported for ease of type checking. All animated values derive from this
   * class.
   *
   * See https://reactnative.dev/docs/animated#node
   */
  Node: AnimatedNode,

  /**
   * Animates a value from an initial velocity to zero based on a decay
   * coefficient.
   *
   * See https://reactnative.dev/docs/animated#decay
   */
  decay,

  /**
   * Animates a value along a timed easing curve. The Easing module has tons of
   * predefined curves, or you can use your own function.
   *
   * See https://reactnative.dev/docs/animated#timing
   */
  timing,

  /**
   * Animates a value according to an analytical spring model based on
   * damped harmonic oscillation.
   *
   * See https://reactnative.dev/docs/animated#spring
   */
  spring,

  /**
   * Creates a new Animated value composed from two Animated values added
   * together.
   *
   * See https://reactnative.dev/docs/animated#add
   */
  add,

  /**
   * Creates a new Animated value composed by subtracting the second Animated
   * value from the first Animated value.
   *
   * See https://reactnative.dev/docs/animated#subtract
   */
  subtract,

  /**
   * Creates a new Animated value composed by dividing the first Animated value
   * by the second Animated value.
   *
   * See https://reactnative.dev/docs/animated#divide
   */
  divide,

  /**
   * Creates a new Animated value composed from two Animated values multiplied
   * together.
   *
   * See https://reactnative.dev/docs/animated#multiply
   */
  multiply,

  /**
   * Creates a new Animated value that is the (non-negative) modulo of the
   * provided Animated value.
   *
   * See https://reactnative.dev/docs/animated#modulo
   */
  modulo,

  /**
   * Create a new Animated value that is limited between 2 values. It uses the
   * difference between the last value so even if the value is far from the
   * bounds it will start changing when the value starts getting closer again.
   *
   * See https://reactnative.dev/docs/animated#diffclamp
   */
  diffClamp,

  /**
   * Starts an animation after the given delay.
   *
   * See https://reactnative.dev/docs/animated#delay
   */
  delay,

  /**
   * Starts an array of animations in order, waiting for each to complete
   * before starting the next. If the current running animation is stopped, no
   * following animations will be started.
   *
   * See https://reactnative.dev/docs/animated#sequence
   */
  sequence,

  /**
   * Starts an array of animations all at the same time. By default, if one
   * of the animations is stopped, they will all be stopped. You can override
   * this with the `stopTogether` flag.
   *
   * See https://reactnative.dev/docs/animated#parallel
   */
  parallel,

  /**
   * Array of animations may run in parallel (overlap), but are started in
   * sequence with successive delays.  Nice for doing trailing effects.
   *
   * See https://reactnative.dev/docs/animated#stagger
   */
  stagger,

  /**
   * Loops a given animation continuously, so that each time it reaches the
   * end, it resets and begins again from the start.
   *
   * See https://reactnative.dev/docs/animated#loop
   */
  loop,

  /**
   * Takes an array of mappings and extracts values from each arg accordingly,
   * then calls `setValue` on the mapped outputs.
   *
   * See https://reactnative.dev/docs/animated#event
   */
  event,

  /**
   * Make any React component Animatable.  Used to create `Animated.View`, etc.
   *
   * See https://reactnative.dev/docs/animated#createanimatedcomponent
   */
  createAnimatedComponent,

  /**
   * Imperative API to attach an animated value to an event on a view. Prefer
   * using `Animated.event` with `useNativeDrive: true` if possible.
   *
   * See https://reactnative.dev/docs/animated#attachnativeevent
   */
  attachNativeEvent,

  /**
   * Advanced imperative API for snooping on animated events that are passed in
   * through props. Use values directly where possible.
   *
   * See https://reactnative.dev/docs/animated#forkevent
   */
  forkEvent,
  unforkEvent,

  /**
   * Expose Event class, so it can be used as a type for type checkers.
   */
  Event: AnimatedEvent,
}
