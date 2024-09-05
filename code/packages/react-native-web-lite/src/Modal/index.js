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

import ModalAnimation from './ModalAnimation'
import ModalContent from './ModalContent'
import ModalFocusTrap from './ModalFocusTrap'
import ModalPortal from './ModalPortal'

var uniqueModalIdentifier = 0
var activeModalStack = []
var activeModalListeners = {}

function notifyActiveModalListeners() {
  if (activeModalStack.length === 0) {
    return
  }

  var activeModalId = activeModalStack[activeModalStack.length - 1]
  activeModalStack.forEach((modalId) => {
    if (modalId in activeModalListeners) {
      activeModalListeners[modalId](modalId === activeModalId)
    }
  })
}

function removeActiveModal(modalId) {
  if (modalId in activeModalListeners) {
    // Before removing this listener we should probably tell it
    // that it's no longer the active modal for sure.
    activeModalListeners[modalId](false)
    delete activeModalListeners[modalId]
  }

  var index = activeModalStack.indexOf(modalId)

  if (index !== -1) {
    activeModalStack.splice(index, 1)
    notifyActiveModalListeners()
  }
}

function addActiveModal(modalId, listener) {
  removeActiveModal(modalId)
  activeModalStack.push(modalId)
  activeModalListeners[modalId] = listener
  notifyActiveModalListeners()
}

var Modal = /*#__PURE__*/ React.forwardRef((props, forwardedRef) => {
  const {
    animationType,
    children,
    onDismiss,
    onRequestClose,
    onShow,
    transparent,
    visible = true,
    ...rest
  } = props

  var modalId = React.useMemo(() => uniqueModalIdentifier++, [])

  var _React$useState = React.useState(false),
    isActive = _React$useState[0],
    setIsActive = _React$useState[1]

  var onDismissCallback = React.useCallback(() => {
    removeActiveModal(modalId)

    if (onDismiss) {
      onDismiss()
    }
  }, [modalId, onDismiss])
  var onShowCallback = React.useCallback(() => {
    addActiveModal(modalId, setIsActive)

    if (onShow) {
      onShow()
    }
  }, [modalId, onShow])
  React.useEffect(() => {
    return () => removeActiveModal(modalId)
  }, [modalId])
  return /*#__PURE__*/ React.createElement(
    ModalPortal,
    null,
    /*#__PURE__*/ React.createElement(
      ModalAnimation,
      {
        animationType: animationType,
        onDismiss: onDismissCallback,
        onShow: onShowCallback,
        visible: visible,
      },
      /*#__PURE__*/ React.createElement(
        ModalFocusTrap,
        {
          active: isActive,
        },
        /*#__PURE__*/ React.createElement(
          ModalContent,
          {
            ...rest,
            active: isActive,
            onRequestClose: onRequestClose,
            ref: forwardedRef,
            transparent: transparent,
          },
          children,
        ),
      ),
    ),
  )
})
export default Modal
