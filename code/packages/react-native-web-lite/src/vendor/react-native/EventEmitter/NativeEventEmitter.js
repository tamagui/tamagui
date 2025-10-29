/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

'use strict'

import { Platform, invariant } from '@tamagui/react-native-web-internals'
import { RCTDeviceEventEmitter } from './RCTDeviceEventEmitter'

/**
 * `NativeEventEmitter` is intended for use by Native Modules to emit events to
 * JavaScript listeners. If a `NativeModule` is supplied to the constructor, it
 * will be notified (via `addListener` and `removeListeners`) when the listener
 * count changes to manage "native memory".
 *
 * Currently, all native events are fired via a global `RCTDeviceEventEmitter`.
 * This means event names must be globally unique, and it means that call sites
 * can theoretically listen to `RCTDeviceEventEmitter` (although discouraged).
 */
class NativeEventEmitter {
  _nativeModule

  constructor(nativeModule) {
    if (Platform.OS === 'ios') {
      invariant(
        nativeModule != null,
        '`new NativeEventEmitter()` requires a non-null argument.'
      )
      this._nativeModule = nativeModule
    }
  }

  addListener(eventType, listener, context) {
    this._nativeModule?.addListener(eventType)
    let subscription = RCTDeviceEventEmitter.addListener(eventType, listener, context)

    return {
      remove: () => {
        if (subscription != null) {
          this._nativeModule?.removeListeners(1)
          // $FlowFixMe[incompatible-use]
          subscription.remove()
          subscription = null
        }
      },
    }
  }

  /**
   * @deprecated Use `remove` on the EventSubscription from `addListener`.
   */
  removeListener(eventType, listener) {
    this._nativeModule?.removeListeners(1)
    // NOTE: This will report a deprecation notice via `console.error`.
    // $FlowFixMe[prop-missing] - `removeListener` exists but is deprecated.
    RCTDeviceEventEmitter.removeListener(eventType, listener)
  }

  emit(eventType, ...args) {
    // Generally, `RCTDeviceEventEmitter` is directly invoked. But this is
    // included for completeness.
    RCTDeviceEventEmitter.emit(eventType, ...args)
  }

  removeAllListeners(eventType) {
    invariant(
      eventType != null,
      '`NativeEventEmitter.removeAllListener()` requires a non-null argument.'
    )
    this._nativeModule?.removeListeners(this.listenerCount(eventType))
    RCTDeviceEventEmitter.removeAllListeners(eventType)
  }

  listenerCount(eventType) {
    return RCTDeviceEventEmitter.listenerCount(eventType)
  }
}

export { NativeEventEmitter }
export default NativeEventEmitter
