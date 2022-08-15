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

import NativeAnimatedHelper from '../NativeAnimatedHelper';
var NativeAnimatedAPI = NativeAnimatedHelper.API;
import invariant from 'fbjs/lib/invariant';
var _uniqueId = 1; // Note(vjeux): this would be better as an interface but flow doesn't
// support them yet

class AnimatedNode {
  __attach() {}

  __detach() {
    if (this.__isNative && this.__nativeTag != null) {
      NativeAnimatedHelper.API.dropAnimatedNode(this.__nativeTag);
      this.__nativeTag = undefined;
    }
  }

  __getValue() {}

  __getAnimatedValue() {
    return this.__getValue();
  }

  __addChild(child) {}

  __removeChild(child) {}

  __getChildren() {
    return [];
  }
  /* Methods and props used by native Animated impl */


  constructor() {
    this._listeners = {};
  }

  __makeNative() {
    if (!this.__isNative) {
      throw new Error('This node cannot be made a "native" animated node');
    }

    if (this.hasListeners()) {
      this._startListeningToNativeValueUpdates();
    }
  }
  /**
   * Adds an asynchronous listener to the value so you can observe updates from
   * animations.  This is useful because there is no way to
   * synchronously read the value because it might be driven natively.
   *
   * See https://reactnative.dev/docs/animatedvalue.html#addlistener
   */


  addListener(callback) {
    var id = String(_uniqueId++);
    this._listeners[id] = callback;

    if (this.__isNative) {
      this._startListeningToNativeValueUpdates();
    }

    return id;
  }
  /**
   * Unregister a listener. The `id` param shall match the identifier
   * previously returned by `addListener()`.
   *
   * See https://reactnative.dev/docs/animatedvalue.html#removelistener
   */


  removeListener(id) {
    delete this._listeners[id];

    if (this.__isNative && !this.hasListeners()) {
      this._stopListeningForNativeValueUpdates();
    }
  }
  /**
   * Remove all registered listeners.
   *
   * See https://reactnative.dev/docs/animatedvalue.html#removealllisteners
   */


  removeAllListeners() {
    this._listeners = {};

    if (this.__isNative) {
      this._stopListeningForNativeValueUpdates();
    }
  }

  hasListeners() {
    return !!Object.keys(this._listeners).length;
  }

  _startListeningToNativeValueUpdates() {
    if (this.__nativeAnimatedValueListener && !this.__shouldUpdateListenersForNewNativeTag) {
      return;
    }

    if (this.__shouldUpdateListenersForNewNativeTag) {
      this.__shouldUpdateListenersForNewNativeTag = false;

      this._stopListeningForNativeValueUpdates();
    }

    NativeAnimatedAPI.startListeningToAnimatedNodeValue(this.__getNativeTag());
    this.__nativeAnimatedValueListener = NativeAnimatedHelper.nativeEventEmitter.addListener('onAnimatedValueUpdate', data => {
      if (data.tag !== this.__getNativeTag()) {
        return;
      }

      this._onAnimatedValueUpdateReceived(data.value);
    });
  }

  _onAnimatedValueUpdateReceived(value) {
    this.__callListeners(value);
  }

  __callListeners(value) {
    for (var _key in this._listeners) {
      this._listeners[_key]({
        value
      });
    }
  }

  _stopListeningForNativeValueUpdates() {
    if (!this.__nativeAnimatedValueListener) {
      return;
    }

    this.__nativeAnimatedValueListener.remove();

    this.__nativeAnimatedValueListener = null;
    NativeAnimatedAPI.stopListeningToAnimatedNodeValue(this.__getNativeTag());
  }

  __getNativeTag() {
    var _this$__nativeTag;

    NativeAnimatedHelper.assertNativeAnimatedModule();
    invariant(this.__isNative, 'Attempt to get native tag from node not marked as "native"');
    var nativeTag = (_this$__nativeTag = this.__nativeTag) !== null && _this$__nativeTag !== void 0 ? _this$__nativeTag : NativeAnimatedHelper.generateNewNodeTag();

    if (this.__nativeTag == null) {
      this.__nativeTag = nativeTag;
      NativeAnimatedHelper.API.createAnimatedNode(nativeTag, this.__getNativeConfig());
      this.__shouldUpdateListenersForNewNativeTag = true;
    }

    return nativeTag;
  }

  __getNativeConfig() {
    throw new Error('This JS animated node type cannot be used as native animated node');
  }

  toJSON() {
    return this.__getValue();
  }

}

export default AnimatedNode;