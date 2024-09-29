/**
 * Copyright (c) Nicolas Gallagher
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react'

import * as ResponderSystem from './ResponderSystem'

export * from './utils'

const emptyObject = {}

const Attached = new WeakMap<any, boolean>()
const Ids = new WeakMap<any, string>()

export function useResponderEvents(
  hostRef: any,
  config: ResponderSystem.ResponderConfig = emptyObject
) {
  if (!Ids.has(hostRef)) {
    Ids.set(hostRef, `${Math.random()}`)
  }
  const id = Ids.get(hostRef)!

  // Register and unregister with the Responder System as necessary
  React.useEffect(() => {
    ResponderSystem.attachListeners()

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

    const requiresResponderSystem = Boolean(
      onMoveShouldSetResponder ||
        onMoveShouldSetResponderCapture ||
        onScrollShouldSetResponder ||
        onScrollShouldSetResponderCapture ||
        onSelectionChangeShouldSetResponder ||
        onSelectionChangeShouldSetResponderCapture ||
        onStartShouldSetResponder ||
        onStartShouldSetResponderCapture
    )

    const node = hostRef.current.host

    if (requiresResponderSystem) {
      ResponderSystem.addNode(id, node, config)
      Attached.set(hostRef, true)

      return () => {
        ResponderSystem.removeNode(node)
      }
    }

    if (Attached.get(node)) {
      ResponderSystem.removeNode(node)
      Attached.set(hostRef, false)
    }
  }, [config, hostRef, id])

  if (process.env.NODE_ENV === 'development') {
    React.useDebugValue({
      isResponder: hostRef.current === ResponderSystem.getResponderNode(),
    })
    React.useDebugValue(config)
  }
}
