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
  configIn: ResponderSystem.ResponderConfig = emptyObject
) {
  const config = getResponderConfigIfDefined(configIn)
  // tamagui + rnw compat
  const node = hostRef?.current?.host || hostRef?.current

  // Register and unregister with the Responder System as necessary
  React.useEffect(() => {
    if (config === emptyObject) return

    ResponderSystem.attachListeners()

    if (!Ids.has(hostRef)) {
      Ids.set(hostRef, `${Math.random()}`)
    }
    const id = Ids.get(hostRef)!

    ResponderSystem.addNode(id, node, config)
    Attached.set(hostRef, true)

    return () => {
      ResponderSystem.removeNode(node)
      Attached.set(hostRef, false)
    }
  }, [config, hostRef])

  if (process.env.NODE_ENV === 'development') {
    React.useDebugValue({
      isResponder: node === ResponderSystem.getResponderNode(),
    })
    React.useDebugValue(config)
  }
}

export function getResponderConfigIfDefined({
  onMoveShouldSetResponder,
  onMoveShouldSetResponderCapture,
  onResponderEnd,
  onResponderGrant,
  onResponderMove,
  onResponderReject,
  onResponderRelease,
  onResponderStart,
  onResponderTerminate,
  onResponderTerminationRequest,
  onScrollShouldSetResponder,
  onScrollShouldSetResponderCapture,
  onSelectionChangeShouldSetResponder,
  onSelectionChangeShouldSetResponderCapture,
  onStartShouldSetResponder,
  onStartShouldSetResponderCapture,
}: ResponderSystem.ResponderConfig): ResponderSystem.ResponderConfig {
  return onMoveShouldSetResponder ||
    onMoveShouldSetResponderCapture ||
    onResponderEnd ||
    onResponderGrant ||
    onResponderMove ||
    onResponderReject ||
    onResponderRelease ||
    onResponderStart ||
    onResponderTerminate ||
    onResponderTerminationRequest ||
    onScrollShouldSetResponder ||
    onScrollShouldSetResponderCapture ||
    onSelectionChangeShouldSetResponder ||
    onSelectionChangeShouldSetResponderCapture ||
    onStartShouldSetResponder ||
    onStartShouldSetResponderCapture
    ? {
        onMoveShouldSetResponder,
        onMoveShouldSetResponderCapture,
        onResponderEnd,
        onResponderGrant,
        onResponderMove,
        onResponderReject,
        onResponderRelease,
        onResponderStart,
        onResponderTerminate,
        onResponderTerminationRequest,
        onScrollShouldSetResponder,
        onScrollShouldSetResponderCapture,
        onSelectionChangeShouldSetResponder,
        onSelectionChangeShouldSetResponderCapture,
        onStartShouldSetResponder,
        onStartShouldSetResponderCapture,
      }
    : emptyObject
}
