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

import { findNodeHandle } from '../../../../findNodeHandle.js'
import { AnimatedEvent } from '../AnimatedEvent.js'
import NativeAnimatedHelper from '../NativeAnimatedHelper.js'
import AnimatedNode from './AnimatedNode.js'
import AnimatedStyle from './AnimatedStyle.js'

export default class AnimatedProps extends AnimatedNode {
  _props
  _animatedView
  _callback

  constructor(props, callback) {
    super()
    if (props.style) {
      props = {
        ...props,
        style: new AnimatedStyle(props.style),
      }
    }
    this._props = props
    this._callback = callback
  }

  __getValue() {
    const props = {}
    for (const key in this._props) {
      const value = this._props[key]
      if (value instanceof AnimatedNode) {
        props[key] = value.__getValue()
      } else if (value instanceof AnimatedEvent) {
        props[key] = value.__getHandler()
      } else {
        props[key] = value
      }
    }

    return props
  }

  __getAnimatedValue() {
    const props = {}
    for (const key in this._props) {
      const value = this._props[key]
      if (value instanceof AnimatedNode) {
        props[key] = value.__getAnimatedValue()
      }
    }
    return props
  }

  __attach() {
    for (const key in this._props) {
      const value = this._props[key]
      if (value instanceof AnimatedNode) {
        value.__addChild(this)
      }
    }
  }

  __detach() {
    if (this.__isNative && this._animatedView) {
      this.__disconnectAnimatedView()
    }
    for (const key in this._props) {
      const value = this._props[key]
      if (value instanceof AnimatedNode) {
        value.__removeChild(this)
      }
    }
    super.__detach()
  }

  update() {
    this._callback()
  }

  __makeNative(platformConfig) {
    if (!this.__isNative) {
      this.__isNative = true
      for (const key in this._props) {
        const value = this._props[key]
        if (value instanceof AnimatedNode) {
          value.__makeNative(platformConfig)
        }
      }

      // Since this does not call the super.__makeNative, we need to store the
      // supplied platformConfig here, before calling __connectAnimatedView
      // where it will be needed to traverse the graph of attached values.
      super.__setPlatformConfig(platformConfig)

      if (this._animatedView) {
        this.__connectAnimatedView()
      }
    }
  }

  setNativeView(animatedView) {
    if (this._animatedView === animatedView) {
      return
    }
    this._animatedView = animatedView
    if (this.__isNative) {
      this.__connectAnimatedView()
    }
  }

  __connectAnimatedView() {
    invariant(this.__isNative, 'Expected node to be marked as "native"')
    const nativeViewTag = findNodeHandle(this._animatedView)
    invariant(
      nativeViewTag != null,
      'Unable to locate attached view in the native tree',
    )
    NativeAnimatedHelper.API.connectAnimatedNodeToView(
      this.__getNativeTag(),
      nativeViewTag,
    )
  }

  __disconnectAnimatedView() {
    invariant(this.__isNative, 'Expected node to be marked as "native"')
    const nativeViewTag = findNodeHandle(this._animatedView)
    invariant(
      nativeViewTag != null,
      'Unable to locate attached view in the native tree',
    )
    NativeAnimatedHelper.API.disconnectAnimatedNodeFromView(
      this.__getNativeTag(),
      nativeViewTag,
    )
  }

  __restoreDefaultValues() {
    // When using the native driver, view properties need to be restored to
    // their default values manually since react no longer tracks them. This
    // is needed to handle cases where a prop driven by native animated is removed
    // after having been changed natively by an animation.
    if (this.__isNative) {
      NativeAnimatedHelper.API.restoreDefaultValues(this.__getNativeTag())
    }
  }

  __getNativeConfig() {
    const propsConfig = {}
    for (const propKey in this._props) {
      const value = this._props[propKey]
      if (value instanceof AnimatedNode) {
        value.__makeNative(this.__getPlatformConfig())
        propsConfig[propKey] = value.__getNativeTag()
      }
    }
    return {
      type: 'props',
      props: propsConfig,
    }
  }
}
