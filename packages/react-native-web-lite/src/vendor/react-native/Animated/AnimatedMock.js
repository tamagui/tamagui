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
import AnimatedImplementation from './AnimatedImplementation'
import createAnimatedComponent from './createAnimatedComponent'
import AnimatedColor from './nodes/AnimatedColor'
import AnimatedInterpolation from './nodes/AnimatedInterpolation'
import AnimatedNode from './nodes/AnimatedNode'
import AnimatedValue from './nodes/AnimatedValue'
import AnimatedValueXY from './nodes/AnimatedValueXY'
/**
 * Animations are a source of flakiness in snapshot testing. This mock replaces
 * animation functions from AnimatedImplementation with empty animations for
 * predictability in tests. When possible the animation will run immediately
 * to the final state.
 */
// Prevent any callback invocation from recursively triggering another
// callback, which may trigger another animation

var inAnimationCallback = false

function mockAnimationStart(start) {
  return (callback) => {
    var guardedCallback =
      callback == null
        ? callback
        : function () {
            if (inAnimationCallback) {
              console.warn(
                'Ignoring recursive animation callback when running mock animations'
              )
              return
            }

            inAnimationCallback = true

            try {
              callback(...arguments)
            } finally {
              inAnimationCallback = false
            }
          }
    start(guardedCallback)
  }
}

var emptyAnimation = {
  start: () => {},
  stop: () => {},
  reset: () => {},
  _startNativeLoop: () => {},
  _isUsingNativeDriver: () => {
    return false
  },
}

var mockCompositeAnimation = (animations) => ({
  ...emptyAnimation,
  start: mockAnimationStart((callback) => {
    animations.forEach((animation) => animation.start())
    callback == null
      ? void 0
      : callback({
          finished: true,
        })
  }),
})

var spring = function spring(value, config) {
  var anyValue = value
  return {
    ...emptyAnimation,
    start: mockAnimationStart((callback) => {
      anyValue.setValue(config.toValue)
      callback == null
        ? void 0
        : callback({
            finished: true,
          })
    }),
  }
}

var timing = function timing(value, config) {
  var anyValue = value
  return {
    ...emptyAnimation,
    start: mockAnimationStart((callback) => {
      anyValue.setValue(config.toValue)
      callback == null
        ? void 0
        : callback({
            finished: true,
          })
    }),
  }
}

var decay = function decay(value, config) {
  return emptyAnimation
}

var sequence = function sequence(animations) {
  return mockCompositeAnimation(animations)
}

var parallel = function parallel(animations, config) {
  return mockCompositeAnimation(animations)
}

var delay = function delay(time) {
  return emptyAnimation
}

var stagger = function stagger(time, animations) {
  return mockCompositeAnimation(animations)
}

var loop = function loop(
  animation, // $FlowFixMe[prop-missing]
  _temp
) {
  var _ref = _temp === void 0 ? {} : _temp,
    _ref$iterations = _ref.iterations,
    iterations = _ref$iterations === void 0 ? -1 : _ref$iterations

  return emptyAnimation
}

export default {
  Value: AnimatedValue,
  ValueXY: AnimatedValueXY,
  Color: AnimatedColor,
  Interpolation: AnimatedInterpolation,
  Node: AnimatedNode,
  decay,
  timing,
  spring,
  add: AnimatedImplementation.add,
  subtract: AnimatedImplementation.subtract,
  divide: AnimatedImplementation.divide,
  multiply: AnimatedImplementation.multiply,
  modulo: AnimatedImplementation.modulo,
  diffClamp: AnimatedImplementation.diffClamp,
  delay,
  sequence,
  parallel,
  stagger,
  loop,
  event: AnimatedImplementation.event,
  createAnimatedComponent,
  attachNativeEvent,
  forkEvent: AnimatedImplementation.forkEvent,
  unforkEvent: AnimatedImplementation.unforkEvent,
  Event: AnimatedEvent,
}
