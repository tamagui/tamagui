import React from 'react' /**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */

import PressResponder from './PressResponder'

// todo
export type PressResponderConfig = any

export function usePressEvents(_, config?: any) {
  const pressResponderRef = React.useRef<any>(null)

  if (pressResponderRef.current == null) {
    pressResponderRef.current = new PressResponder(config)
  }

  const pressResponder = pressResponderRef.current // Re-configure to use the current node and configuration.

  React.useEffect(() => {
    pressResponder.configure(config)
  }, [config, pressResponder]) // Reset the `pressResponder` when cleanup needs to occur. This is
  // a separate effect because we do not want to rest the responder when `config` changes.

  React.useEffect(() => {
    return () => {
      pressResponder.reset()
    }
  }, [pressResponder])
  React.useDebugValue(config)
  return pressResponder.getEventHandlers()
}
