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

import { AnimatedEvent, attachNativeEvent } from './AnimatedEvent.js'
import AnimatedImplementation from './AnimatedImplementation.js'
import createAnimatedComponent from './createAnimatedComponent.js'
import AnimatedColor from './nodes/AnimatedColor.js'
import AnimatedInterpolation from './nodes/AnimatedInterpolation.js'
import AnimatedNode from './nodes/AnimatedNode.js'
import AnimatedValue from './nodes/AnimatedValue.js'
import AnimatedValueXY from './nodes/AnimatedValueXY.js'

/**
 * Animations are a source of flakiness in snapshot testing. This mock replaces
 * animation functions from AnimatedImplementation with empty animations for
 * predictability in tests. When possible the animation will run immediately
 * to the final state.
 */

// Prevent any callback invocation from recursively triggering another
// callback, which may trigger another animation
let inAnimationCallback = false
function mockAnimationStart(start) {
  return (callback) => {
    const guardedCallback =
      callback == null
        ? callback
        : (...args) => {
            if (inAnimationCallback) {
              console.warn(
                'Ignoring recursive animation callback when running mock animations',
              )
              return
            }
            inAnimationCallback = true
            try {
              callback(...args)
            } finally {
              inAnimationCallback = false
            }
          }
    start(guardedCallback)
  }
}

const emptyAnimation = {
  start: () => {},
  stop: () => {},
  reset: () => {},
  _startNativeLoop: () => {},
  _isUsingNativeDriver: () => {
    return false
  },
}

const mockCompositeAnimation = (animations) => ({
  ...emptyAnimation,
  start: mockAnimationStart((callback) => {
    animations.forEach((animation) => animation.start())
    callback?.({ finished: true })
  }),
})

const spring = function (value, config) {
  const anyValue = value
  return {
    ...emptyAnimation,
    start: mockAnimationStart((callback) => {
      anyValue.setValue(config.toValue)
      callback?.({ finished: true })
    }),
  }
}

const timing = function (value, config) {
  const anyValue = value
  return {
    ...emptyAnimation,
    start: mockAnimationStart((callback) => {
      anyValue.setValue(config.toValue)
      callback?.({ finished: true })
    }),
  }
}

const decay = function (value, config) {
  return emptyAnimation
}

const sequence = function (animations) {
  return mockCompositeAnimation(animations)
}

const parallel = function (animations, config) {
  return mockCompositeAnimation(animations)
}

const delay = function (time) {
  return emptyAnimation
}

const stagger = function (time, animations) {
  return mockCompositeAnimation(animations)
}

const loop = function (
  animation,
  // $FlowFixMe[prop-missing]
  { iterations = -1 } = {},
) {
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
