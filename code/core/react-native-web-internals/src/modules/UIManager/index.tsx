// @ts-nocheck
/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import { getRect, measureLayout } from '@tamagui/use-element-layout'

const focusableElements = {
  A: true,
  INPUT: true,
  SELECT: true,
  TEXTAREA: true,
}

const UIManager = {
  blur(node) {
    try {
      node.blur()
    } catch (err) {
      //
    }
  },

  focus(node) {
    try {
      const name = node.nodeName
      // A tabIndex of -1 allows element to be programmatically focused but
      // prevents keyboard focus, so we don't want to set the value on elements
      // that support keyboard focus by default.
      if (node.getAttribute('tabIndex') == null && focusableElements[name] == null) {
        node.setAttribute('tabIndex', '-1')
      }
      node.focus()
    } catch (err) {
      //
    }
  },

  measure(node, callback) {
    measureLayout(node, null, callback)
  },

  measureInWindow(node, callback) {
    if (node) {
      setTimeout(() => {
        const rect = getRect(node)
        if (rect) {
          const { height, left, top, width } = rect
          callback(left, top, width, height)
        }
      }, 0)
    }
  },

  measureLayout(node, relativeToNativeNode, onFail, onSuccess) {
    measureLayout(node, relativeToNativeNode, onSuccess)
  },

  configureNextLayoutAnimation(config, onAnimationDidEnd) {
    onAnimationDidEnd()
  },

  // mocks
  setLayoutAnimationEnabledExperimental() {},
}

export default UIManager
