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

import _createForOfIteratorHelperLoose from "@babel/runtime/helpers/createForOfIteratorHelperLoose";
import AnimatedNode from './AnimatedNode';
import NativeAnimatedHelper from '../NativeAnimatedHelper';

class AnimatedWithChildren extends AnimatedNode {
  constructor() {
    super();
    this._children = [];
  }

  __makeNative(platformConfig) {
    if (!this.__isNative) {
      this.__isNative = true;

      for (var _iterator = _createForOfIteratorHelperLoose(this._children), _step; !(_step = _iterator()).done;) {
        var child = _step.value;

        child.__makeNative(platformConfig);

        NativeAnimatedHelper.API.connectAnimatedNodes(this.__getNativeTag(), child.__getNativeTag());
      }
    }

    super.__makeNative(platformConfig);
  }

  __addChild(child) {
    if (this._children.length === 0) {
      this.__attach();
    }

    this._children.push(child);

    if (this.__isNative) {
      // Only accept "native" animated nodes as children
      child.__makeNative(this.__getPlatformConfig());

      NativeAnimatedHelper.API.connectAnimatedNodes(this.__getNativeTag(), child.__getNativeTag());
    }
  }

  __removeChild(child) {
    var index = this._children.indexOf(child);

    if (index === -1) {
      console.warn("Trying to remove a child that doesn't exist");
      return;
    }

    if (this.__isNative && child.__isNative) {
      NativeAnimatedHelper.API.disconnectAnimatedNodes(this.__getNativeTag(), child.__getNativeTag());
    }

    this._children.splice(index, 1);

    if (this._children.length === 0) {
      this.__detach();
    }
  }

  __getChildren() {
    return this._children;
  }

  __callListeners(value) {
    super.__callListeners(value);

    if (!this.__isNative) {
      for (var _iterator2 = _createForOfIteratorHelperLoose(this._children), _step2; !(_step2 = _iterator2()).done;) {
        var child = _step2.value;

        // $FlowFixMe[method-unbinding] added when improving typing for this parameters
        if (child.__getValue) {
          child.__callListeners(child.__getValue());
        }
      }
    }
  }

}

export default AnimatedWithChildren;