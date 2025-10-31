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
import ReactDOM from 'react-dom'
import { canUseDOM } from '@tamagui/react-native-web-internals'

export function ModalPortal(props) {
  var children = props.children
  var elementRef = React.useRef(null)

  if (canUseDOM && !elementRef.current) {
    var element = document.createElement('div')

    if (element && document.body) {
      document.body.appendChild(element)
      elementRef.current = element
    }
  }

  React.useEffect(() => {
    if (canUseDOM) {
      return () => {
        if (document.body && elementRef.current) {
          document.body.removeChild(elementRef.current)
          elementRef.current = null
        }
      }
    }
  }, [])
  return elementRef.current && canUseDOM
    ? /*#__PURE__*/ ReactDOM.createPortal(children, elementRef.current)
    : null
}
