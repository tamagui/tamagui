/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */

'use strict'

import { invariant } from '@tamagui/react-native-web-internals'

export function get(name) {
  return null
}

export function getEnforcing(name) {
  const module = get(name)
  invariant(
    module != null,
    `TurboModuleRegistry.getEnforcing(...): '${name}' could not be found. ` +
      'Verify that a module by this name is registered in the native binary.'
  )
  return module
}
