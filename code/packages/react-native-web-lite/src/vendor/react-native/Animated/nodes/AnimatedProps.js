/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */

import { AnimatedEvent } from '../AnimatedEvent'
import AnimatedNode from './AnimatedNode'
import AnimatedStyle from './AnimatedStyle'
import NativeAnimatedHelper from '../NativeAnimatedHelper'

import { invariant } from '@tamagui/react-native-web-internals'

class AnimatedProps extends AnimatedNode {
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
    this.__attach()
  }

  __getValue() {
    const props = {}
    for (const key in this._props) {
      const value = this._props[key]
      if (value instanceof AnimatedNode) {
        if (!value.__isNative || value instanceof AnimatedStyle) {
          // We cannot use value of natively driven nodes this way as the value we have access from
          // JS may not be up to date.
          props[key] = value.__getValue()
        }
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

  __makeNative() {
    if (!this.__isNative) {
      this.__isNative = true
      for (const key in this._props) {
        const value = this._props[key]
        if (value instanceof AnimatedNode) {
          value.__makeNative()
        }
      }
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
    const nativeViewTag = this._animatedView
    invariant(nativeViewTag != null, 'Unable to locate attached view in the native tree')
    NativeAnimatedHelper.API.connectAnimatedNodeToView(
      this.__getNativeTag(),
      nativeViewTag
    )
  }

  __disconnectAnimatedView() {
    invariant(this.__isNative, 'Expected node to be marked as "native"')
    const nativeViewTag = this._animatedView
    invariant(nativeViewTag != null, 'Unable to locate attached view in the native tree')
    NativeAnimatedHelper.API.disconnectAnimatedNodeFromView(
      this.__getNativeTag(),
      nativeViewTag
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
        value.__makeNative()
        propsConfig[propKey] = value.__getNativeTag()
      }
    }
    return {
      type: 'props',
      props: propsConfig,
    }
  }
}

export default AnimatedProps
