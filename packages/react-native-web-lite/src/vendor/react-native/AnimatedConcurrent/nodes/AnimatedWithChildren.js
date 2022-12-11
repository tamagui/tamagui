/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *       strict-local
 * @format
 */

'use strict'

import NativeAnimatedHelper from '../NativeAnimatedHelper.js'
import AnimatedNode from './AnimatedNode.js'

export default class AnimatedWithChildren extends AnimatedNode {
  _children

  constructor() {
    super()
    this._children = []
  }

  __makeNative(platformConfig) {
    if (!this.__isNative) {
      this.__isNative = true
      for (const child of this._children) {
        child.__makeNative(platformConfig)
        NativeAnimatedHelper.API.connectAnimatedNodes(this.__getNativeTag(), child.__getNativeTag())
      }
    }
    super.__makeNative(platformConfig)
  }

  __addChild(child) {
    if (this._children.length === 0) {
      this.__attach()
    }
    this._children.push(child)
    if (this.__isNative) {
      // Only accept "native" animated nodes as children
      child.__makeNative(this.__getPlatformConfig())
      NativeAnimatedHelper.API.connectAnimatedNodes(this.__getNativeTag(), child.__getNativeTag())
    }
  }

  __removeChild(child) {
    const index = this._children.indexOf(child)
    if (index === -1) {
      console.warn("Trying to remove a child that doesn't exist")
      return
    }
    if (this.__isNative && child.__isNative) {
      NativeAnimatedHelper.API.disconnectAnimatedNodes(
        this.__getNativeTag(),
        child.__getNativeTag()
      )
    }
    this._children.splice(index, 1)
    if (this._children.length === 0) {
      this.__detach()
    }
  }

  __getChildren() {
    return this._children
  }

  __callListeners(value) {
    super.__callListeners(value)
    if (!this.__isNative) {
      for (const child of this._children) {
        // $FlowFixMe[method-unbinding] added when improving typing for this parameters
        if (child.__getValue) {
          child.__callListeners(child.__getValue())
        }
      }
    }
  }
}
