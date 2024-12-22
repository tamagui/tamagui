/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */
import * as React from 'react'
import { StyleSheet, canUseDOM } from '@tamagui/react-native-web-internals'

import View from '../View'

var ModalContent = /*#__PURE__*/ React.forwardRef((props, forwardedRef) => {
  const { active, children, onRequestClose, transparent, ...rest } = props

  React.useEffect(() => {
    if (canUseDOM) {
      var closeOnEscape = (e) => {
        if (active && e.key === 'Escape') {
          e.stopPropagation()

          if (onRequestClose) {
            onRequestClose()
          }
        }
      }

      document.addEventListener('keyup', closeOnEscape, false)
      return () => document.removeEventListener('keyup', closeOnEscape, false)
    }
  }, [active, onRequestClose])
  var style = React.useMemo(() => {
    return [styles.modal, transparent ? styles.modalTransparent : styles.modalOpaque]
  }, [transparent])
  return /*#__PURE__*/ React.createElement(
    View,
    {
      ...rest,
      accessibilityModal: true,
      accessibilityRole: active ? 'dialog' : null,
      ref: forwardedRef,
      style: style,
    },
    /*#__PURE__*/ React.createElement(
      View,
      {
        style: styles.container,
      },
      children
    )
  )
})
var styles = StyleSheet.create({
  modal: {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  modalTransparent: {
    backgroundColor: 'transparent',
  },
  modalOpaque: {
    backgroundColor: 'white',
  },
  container: {
    top: 0,
    flex: 1,
  },
})
export default ModalContent
