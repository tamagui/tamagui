/**
 * Copyright (c) Nicolas Gallagher
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react'

import * as ResponderSystem from './ResponderSystem'

export * from './utils'

const emptyObject = {}

export function useResponderEvents(
  hostRef: any,
  config: ResponderSystem.ResponderConfig = emptyObject
) {
  const id = React.useId()
  const isAttachedRef = React.useRef(false)

  // This is a separate effects so it doesn't run when the config changes.
  // On initial mount, attach global listeners if needed.
  // On unmount, remove node potentially attached to the Responder System.
  React.useEffect(() => {
    ResponderSystem.attachListeners()
    return () => {
      ResponderSystem.removeNode(id)
    }
  }, [id])

  // Register and unregister with the Responder System as necessary
  React.useEffect(() => {
    const {
      onMoveShouldSetResponder,
      onMoveShouldSetResponderCapture,
      onScrollShouldSetResponder,
      onScrollShouldSetResponderCapture,
      onSelectionChangeShouldSetResponder,
      onSelectionChangeShouldSetResponderCapture,
      onStartShouldSetResponder,
      onStartShouldSetResponderCapture,
    } = config

    const requiresResponderSystem =
      onMoveShouldSetResponder != null ||
      onMoveShouldSetResponderCapture != null ||
      onScrollShouldSetResponder != null ||
      onScrollShouldSetResponderCapture != null ||
      onSelectionChangeShouldSetResponder != null ||
      onSelectionChangeShouldSetResponderCapture != null ||
      onStartShouldSetResponder != null ||
      onStartShouldSetResponderCapture != null

    const node = hostRef.current

    if (requiresResponderSystem) {
      ResponderSystem.addNode(id, node, config)
      isAttachedRef.current = true
    } else if (isAttachedRef.current) {
      ResponderSystem.removeNode(id)
      isAttachedRef.current = false
    }
  }, [config, hostRef, id])

  if (process.env.NODE_ENV === 'development') {
    React.useDebugValue({
      isResponder: hostRef.current === ResponderSystem.getResponderNode(),
    })
    React.useDebugValue(config)
  }
}
