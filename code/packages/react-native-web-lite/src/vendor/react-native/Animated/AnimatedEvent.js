/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */

'use strict'

import { AnimatedValue } from './nodes/AnimatedValue'
import { NativeAnimatedHelper } from './NativeAnimatedHelper'

import { invariant } from '@tamagui/react-native-web-internals'

import { shouldUseNativeDriver } from './NativeAnimatedHelper'

// EventConfig interface removed

const __DEV__ = process.env.NODE_ENV !== 'production'

export function attachNativeEvent(viewRef, eventName, argMapping) {
  // Find animated values in `argMapping` and create an array representing their
  // key path inside the `nativeEvent` object. Ex.: ['contentOffset', 'x'].
  const eventMappings = []

  const traverse = (value, path) => {
    if (value instanceof AnimatedValue) {
      value.__makeNative()

      eventMappings.push({
        nativeEventPath: path,
        animatedValueTag: value.__getNativeTag(),
      })
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

  if (viewRef != null) {
    eventMappings.forEach((mapping) => {
      NativeAnimatedHelper.API.addAnimatedEventToView(viewRef, eventName, mapping)
    })
  }

  return {
    detach() {
      if (viewRef != null) {
        eventMappings.forEach((mapping) => {
          NativeAnimatedHelper.API.removeAnimatedEventFromView(
            viewRef,
            eventName,
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
    invariant(
      typeof recEvt === 'object',
      'Bad event of type ' + typeof recEvt + ' for key ' + key
    )
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

  constructor(argMapping, config) {
    this._argMapping = argMapping

    if (config == null) {
      console.warn('Animated.event now requires a second argument for options')
      config = { useNativeDriver: false }
    }

    if (config.listener) {
      this.__addListener(config.listener)
    }
    this._callListeners = this._callListeners.bind(this)
    this._attachedEvent = null
    this.__isNative = shouldUseNativeDriver(config)
  }

  __addListener(callback) {
    this._listeners.push(callback)
  }

  __removeListener(callback) {
    this._listeners = this._listeners.filter((listener) => listener !== callback)
  }

  __attach(viewRef, eventName) {
    invariant(this.__isNative, 'Only native driven events need to be attached.')

    this._attachedEvent = attachNativeEvent(viewRef, eventName, this._argMapping)
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

      const traverse = (recMapping, recEvt, key) => {
        if (recMapping instanceof AnimatedValue) {
          if (typeof recEvt === 'number') {
            recMapping.setValue(recEvt)
          }
        } else if (typeof recMapping === 'object') {
          for (const mappingKey in recMapping) {
            traverse(recMapping[mappingKey], recEvt[mappingKey], mappingKey)
          }
        }
      }
      this._argMapping.forEach((mapping, idx) => {
        traverse(mapping, args[idx], 'arg' + idx)
      })

      this._callListeners(...args)
    }
  }

  _callListeners(...args) {
    this._listeners.forEach((listener) => listener(...args))
  }
}
