/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { dismissKeyboard } from '@tamagui/react-native-web-internals'

export const Keyboard = {
  addListener(): {
    remove: () => void
  } {
    return { remove: () => {} }
  },
  dismiss() {
    dismissKeyboard()
  },
  removeAllListeners() {},
  removeListener() {},
}
