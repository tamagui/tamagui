/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type { Context } from 'react'
import { createContext } from 'react'

export const TextAncestorContext = createContext(false)
export default TextAncestorContext as Context<boolean>
