/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

/* eslint no-bitwise: 0 */

'use strict'

import AnimatedWithChildren from './AnimatedWithChildren'
import NativeAnimatedHelper from '../NativeAnimatedHelper'
import { normalizeColor, invariant } from '@tamagui/react-native-web-internals'

const __DEV__ = process.env.NODE_ENV !== 'production'

const linear = (t) => t

/**
 * Very handy helper to map input ranges to output ranges with an easing
 * function and custom behavior outside of the ranges.
 */
function createInterpolation(config) {
  if (config.outputRange && typeof config.outputRange[0] === 'string') {
    return createInterpolationFromStringOutputRange(config)
  }

  const outputRange = config.outputRange
  const inputRange = config.inputRange

  if (__DEV__) {
    checkInfiniteRange('outputRange', outputRange)
    checkInfiniteRange('inputRange', inputRange)
    checkValidInputRange(inputRange)

    invariant(
      inputRange.length === outputRange.length,
      'inputRange (' +
        inputRange.length +
        ') and outputRange (' +
        outputRange.length +
        ') must have the same length'
    )
  }

  const easing = config.easing || linear

  let extrapolateLeft = 'extend'
  if (config.extrapolateLeft !== undefined) {
    extrapolateLeft = config.extrapolateLeft
  } else if (config.extrapolate !== undefined) {
    extrapolateLeft = config.extrapolate
  }

  let extrapolateRight = 'extend'
  if (config.extrapolateRight !== undefined) {
    extrapolateRight = config.extrapolateRight
  } else if (config.extrapolate !== undefined) {
    extrapolateRight = config.extrapolate
  }

  return (input) => {
    invariant(
      typeof input === 'number',
      'Cannot interpolation an input which is not a number'
    )

    const range = findRange(input, inputRange)
    return interpolate(
      input,
      inputRange[range],
      inputRange[range + 1],
      outputRange[range],
      outputRange[range + 1],
      easing,
      extrapolateLeft,
      extrapolateRight
    )
  }
}

function interpolate(
  input,
  inputMin,
  inputMax,
  outputMin,
  outputMax,
  easing,
  extrapolateLeft,
  extrapolateRight
) {
  let result = input

  // Extrapolate
  if (result < inputMin) {
    if (extrapolateLeft === 'identity') {
      return result
    } else if (extrapolateLeft === 'clamp') {
      result = inputMin
    } else if (extrapolateLeft === 'extend') {
      // noop
    }
  }

  if (result > inputMax) {
    if (extrapolateRight === 'identity') {
      return result
    } else if (extrapolateRight === 'clamp') {
      result = inputMax
    } else if (extrapolateRight === 'extend') {
      // noop
    }
  }

  if (outputMin === outputMax) {
    return outputMin
  }

  if (inputMin === inputMax) {
    if (input <= inputMin) {
      return outputMin
    }
    return outputMax
  }

  // Input Range
  if (inputMin === -Infinity) {
    result = -result
  } else if (inputMax === Infinity) {
    result = result - inputMin
  } else {
    result = (result - inputMin) / (inputMax - inputMin)
  }

  // Easing
  result = easing(result)

  // Output Range
  if (outputMin === -Infinity) {
    result = -result
  } else if (outputMax === Infinity) {
    result = result + outputMin
  } else {
    result = result * (outputMax - outputMin) + outputMin
  }

  return result
}

function colorToRgba(input) {
  let normalizedColor = normalizeColor(input)
  if (normalizedColor === null || typeof normalizedColor !== 'number') {
    return input
  }

  normalizedColor = normalizedColor || 0

  const r = (normalizedColor & 0xff000000) >>> 24
  const g = (normalizedColor & 0x00ff0000) >>> 16
  const b = (normalizedColor & 0x0000ff00) >>> 8
  const a = (normalizedColor & 0x000000ff) / 255

  return `rgba(${r}, ${g}, ${b}, ${a})`
}

const stringShapeRegex = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g

/**
 * Supports string shapes by extracting numbers so new values can be computed,
 * and recombines those values into new strings of the same shape.  Supports
 * things like:
 *
 *   rgba(123, 42, 99, 0.36) // colors
 *   -45deg                  // values with units
 */
function createInterpolationFromStringOutputRange(config) {
  let outputRange = config.outputRange
  invariant(outputRange.length >= 2, 'Bad output range')
  outputRange = outputRange.map(colorToRgba)
  checkPattern(outputRange)

  // ['rgba(0, 100, 200, 0)', 'rgba(50, 150, 250, 0.5)']
  // ->
  // [
  //   [0, 50],
  //   [100, 150],
  //   [200, 250],
  //   [0, 0.5],
  // ]
  const outputRanges = outputRange[0].match(stringShapeRegex).map(() => [])
  outputRange.forEach((value) => {
    value.match(stringShapeRegex).forEach((number, i) => {
      outputRanges[i].push(+number)
    })
  })

  const interpolations = outputRange[0]
    .match(stringShapeRegex)
    .map((value, i) => {
      return createInterpolation({
        ...config,
        outputRange: outputRanges[i],
      })
    })

  // rgba requires that the r,g,b are integers.... so we want to round them, but we *dont* want to
  // round the opacity (4th column).
  const shouldRound = isRgbOrRgba(outputRange[0])

  return (input) => {
    let i = 0
    // 'rgba(0, 100, 200, 0)'
    // ->
    // 'rgba(${interpolations[0](input)}, ${interpolations[1](input)}, ...'
    return outputRange[0].replace(stringShapeRegex, () => {
      let val = +interpolations[i++](input)
      if (shouldRound) {
        val = i < 4 ? Math.round(val) : Math.round(val * 1000) / 1000
      }
      return String(val)
    })
  }
}

function isRgbOrRgba(range) {
  return typeof range === 'string' && range.startsWith('rgb')
}

function checkPattern(arr) {
  const pattern = arr[0].replace(stringShapeRegex, '')
  for (let i = 1; i < arr.length; ++i) {
    invariant(
      pattern === arr[i].replace(stringShapeRegex, ''),
      'invalid pattern ' + arr[0] + ' and ' + arr[i]
    )
  }
}

function findRange(input, inputRange) {
  let i
  for (i = 1; i < inputRange.length - 1; ++i) {
    if (inputRange[i] >= input) {
      break
    }
  }
  return i - 1
}

function checkValidInputRange(arr) {
  invariant(arr.length >= 2, 'inputRange must have at least 2 elements')
  const message =
    'inputRange must be monotonically non-decreasing ' + String(arr)
  for (let i = 1; i < arr.length; ++i) {
    invariant(arr[i] >= arr[i - 1], message)
  }
}

function checkInfiniteRange(name, arr) {
  invariant(arr.length >= 2, name + ' must have at least 2 elements')
  invariant(
    arr.length !== 2 || arr[0] !== -Infinity || arr[1] !== Infinity,
    name + 'cannot be ]-infinity;+infinity[ ' + arr
  )
}

class AnimatedInterpolation extends AnimatedWithChildren {
  // Export for testing.
  static __createInterpolation = createInterpolation

  constructor(parent, config) {
    super()
    this._parent = parent
    this._config = config
    this._interpolation = createInterpolation(config)
  }

  __makeNative(platformConfig) {
    this._parent.__makeNative(platformConfig)
    super.__makeNative(platformConfig)
  }

  __getValue() {
    const parentValue = this._parent.__getValue()
    invariant(
      typeof parentValue === 'number',
      'Cannot interpolate an input which is not a number.'
    )
    return this._interpolation(parentValue)
  }

  interpolate(config) {
    return new AnimatedInterpolation(this, config)
  }

  __attach() {
    this._parent.__addChild(this)
  }

  __detach() {
    this._parent.__removeChild(this)
    super.__detach()
  }

  __transformDataType(range) {
    return range.map(NativeAnimatedHelper.transformDataType)
  }

  __getNativeConfig() {
    if (__DEV__) {
      NativeAnimatedHelper.validateInterpolation(this._config)
    }

    return {
      inputRange: this._config.inputRange,
      // Only the `outputRange` can contain strings so we don't need to transform `inputRange` here
      outputRange: this.__transformDataType(this._config.outputRange),
      extrapolateLeft:
        this._config.extrapolateLeft || this._config.extrapolate || 'extend',
      extrapolateRight:
        this._config.extrapolateRight || this._config.extrapolate || 'extend',
      type: 'interpolation',
    }
  }
}

export default AnimatedInterpolation
