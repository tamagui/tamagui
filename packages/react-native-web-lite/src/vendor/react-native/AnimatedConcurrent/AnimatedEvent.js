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

import invariant from 'invariant'

import { findNodeHandle } from '../../../findNodeHandle.js'
import NativeAnimatedHelper from './NativeAnimatedHelper.js'
import AnimatedValue from './nodes/AnimatedValue.js'
import AnimatedValueXY from './nodes/AnimatedValueXY.js'

export function attachNativeEvent(viewRef, eventName, argMapping, platformConfig) {
  // Find animated values in `argMapping` and create an array representing their
  // key path inside the `nativeEvent` object. Ex.: ['contentOffset', 'x'].
  const eventMappings = []

  const traverse = (value, path) => {
    if (value instanceof AnimatedValue) {
      value.__makeNative(platformConfig)

      eventMappings.push({
        nativeEventPath: path,
        animatedValueTag: value.__getNativeTag(),
      })
    } else if (value instanceof AnimatedValueXY) {
      traverse(value.x, path.concat('x'))
      traverse(value.y, path.concat('y'))
    } else if (typeof value === 'object') {
      for (const key in value) {
        traverse(value[key], path.concat(key))
      }
    }
  }

  invariant(
    argMapping[0] && argMapping[0].nativeEvent,
    'Native driven events only support animated values contained inside `nativeEvent`.'
  )

  // Assume that the event containing `nativeEvent` is always the first argument.
  traverse(argMapping[0].nativeEvent, [])

  const viewTag = findNodeHandle(viewRef)
  if (viewTag != null) {
    eventMappings.forEach((mapping) => {
      NativeAnimatedHelper.API.addAnimatedEventToView(viewTag, eventName, mapping)
    })
  }

  return {
    detach() {
      if (viewTag != null) {
        eventMappings.forEach((mapping) => {
          NativeAnimatedHelper.API.removeAnimatedEventFromView(
            viewTag,
            eventName,
            // $FlowFixMe[incompatible-call]
            mapping.animatedValueTag
          )
        })
      }
    },
  }
}

function validateMapping(argMapping, args) {
  const validate = (recMapping, recEvt, key) => {
    if (recMapping instanceof AnimatedValue) {
      invariant(
        typeof recEvt === 'number',
        'Bad mapping of event key ' + key + ', should be number but got ' + typeof recEvt
      )
      return
    }
    if (recMapping instanceof AnimatedValueXY) {
      invariant(
        typeof recEvt.x === 'number' && typeof recEvt.y === 'number',
        'Bad mapping of event key ' + key + ', should be XY but got ' + recEvt
      )
      return
    }
    if (typeof recEvt === 'number') {
      invariant(
        recMapping instanceof AnimatedValue,
        'Bad mapping of type ' +
          typeof recMapping +
          ' for key ' +
          key +
          ', event value must map to AnimatedValue'
      )
      return
    }
    invariant(
      typeof recMapping === 'object',
      'Bad mapping of type ' + typeof recMapping + ' for key ' + key
    )
    invariant(typeof recEvt === 'object', 'Bad event of type ' + typeof recEvt + ' for key ' + key)
    for (const mappingKey in recMapping) {
      validate(recMapping[mappingKey], recEvt[mappingKey], mappingKey)
    }
  }

  invariant(args.length >= argMapping.length, 'Event has less arguments than mapping')
  argMapping.forEach((mapping, idx) => {
    validate(mapping, args[idx], 'arg' + idx)
  })
}

export class AnimatedEvent {
  _argMapping
  _listeners = []
  _attachedEvent
  __isNative
  __platformConfig

  constructor(argMapping, config) {
    this._argMapping = argMapping

    if (config == null) {
      console.warn('Animated.event now requires a second argument for options')
      config = { useNativeDriver: false }
    }

    if (config.listener) {
      this.__addListener(config.listener)
    }
    this._attachedEvent = null
    this.__isNative = NativeAnimatedHelper.shouldUseNativeDriver(config)
    this.__platformConfig = config.platformConfig
  }

  __addListener(callback) {
    this._listeners.push(callback)
  }

  __removeListener(callback) {
    this._listeners = this._listeners.filter((listener) => listener !== callback)
  }

  __attach(viewRef, eventName) {
    invariant(this.__isNative, 'Only native driven events need to be attached.')

    this._attachedEvent = attachNativeEvent(
      viewRef,
      eventName,
      this._argMapping,
      this.__platformConfig
    )
  }

  __detach(viewTag, eventName) {
    invariant(this.__isNative, 'Only native driven events need to be detached.')

    this._attachedEvent && this._attachedEvent.detach()
  }

  __getHandler() {
    if (this.__isNative) {
      if (__DEV__) {
        let validatedMapping = false
        return (...args) => {
          if (!validatedMapping) {
            validateMapping(this._argMapping, args)
            validatedMapping = true
          }
          this._callListeners(...args)
        }
      } else {
        return this._callListeners
      }
    }

    let validatedMapping = false
    return (...args) => {
      if (__DEV__ && !validatedMapping) {
        validateMapping(this._argMapping, args)
        validatedMapping = true
      }

      const traverse = (recMapping, recEvt) => {
        if (recMapping instanceof AnimatedValue) {
          if (typeof recEvt === 'number') {
            recMapping.setValue(recEvt)
          }
        } else if (recMapping instanceof AnimatedValueXY) {
          if (typeof recEvt === 'object') {
            traverse(recMapping.x, recEvt.x)
            traverse(recMapping.y, recEvt.y)
          }
        } else if (typeof recMapping === 'object') {
          for (const mappingKey in recMapping) {
            /* $FlowFixMe[prop-missing] (>=0.120.0) This comment suppresses an
             * error found when Flow v0.120 was deployed. To see the error,
             * delete this comment and run Flow. */
            traverse(recMapping[mappingKey], recEvt[mappingKey])
          }
        }
      }
      this._argMapping.forEach((mapping, idx) => {
        traverse(mapping, args[idx])
      })

      this._callListeners(...args)
    }
  }

  _callListeners = (...args) => {
    this._listeners.forEach((listener) => listener(...args))
  }
}
