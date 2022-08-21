/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { useRef } from 'react'

import type { GenericStyleProp } from '../../types.js'
import createDOMProps from '../createDOMProps/index.js'
import UIManager from '../UIManager/index.js'
import useStable from '../useStable/index.js'

let didWarn = false
const emptyObject = {}

function setNativeProps(node, nativeProps, pointerEvents, style, previousStyleRef) {
  if (process.env.NODE_ENV === 'development') {
    if (!didWarn) {
      // eslint-disable-next-line no-console
      console.warn('setNativeProps is deprecated. Please update props using React state instead.')
      didWarn = true
    }
  }

  if (node != null && nativeProps) {
    const domProps = createDOMProps(null, {
      pointerEvents,
      ...nativeProps,
      style: [style, nativeProps.style],
    })

    const nextDomStyle = domProps.style

    if (previousStyleRef.current != null) {
      if (domProps.style == null) {
        domProps.style = {}
      }
      for (const styleName in previousStyleRef.current) {
        if (domProps.style[styleName] == null) {
          domProps.style[styleName] = ''
        }
      }
    }

    previousStyleRef.current = nextDomStyle

    UIManager.updateView(node, domProps)
  }
}

/**
 * Adds non-standard methods to the hode element. This is temporarily until an
 * API like `ReactNative.measure(hostRef, callback)` is added to React Native.
 */
export default function usePlatformMethods({
  pointerEvents,
  style,
}: {
  style?: GenericStyleProp<unknown>
  pointerEvents?: any
}): (hostNode: any) => void {
  const previousStyleRef = useRef(null)
  const setNativePropsArgsRef = useRef<any>(null)
  setNativePropsArgsRef.current = { pointerEvents, style }

  // Avoid creating a new ref on every render. The props only need to be
  // available to 'setNativeProps' when it is called.
  const ref = useStable(() => (hostNode: any) => {
    if (hostNode != null) {
      hostNode.measure = (callback) => UIManager.measure(hostNode, callback)
      hostNode.measureLayout = (relativeToNode, success, failure) =>
        UIManager.measureLayout(hostNode, relativeToNode, failure, success)
      hostNode.measureInWindow = (callback) => UIManager.measureInWindow(hostNode, callback)
      hostNode.setNativeProps = (nativeProps) => {
        const { style, pointerEvents } = setNativePropsArgsRef.current || emptyObject
        setNativeProps(hostNode, nativeProps, pointerEvents, style, previousStyleRef)
      }
    }
  })

  return ref
}
