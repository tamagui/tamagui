/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { TextInputState } from '../TextInputState/index'

export const dismissKeyboard = () => {
  TextInputState.blurTextInput(TextInputState.currentlyFocusedField())
}
