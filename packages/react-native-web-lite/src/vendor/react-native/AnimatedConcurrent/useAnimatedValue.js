/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *       strict-local
 * @format
 */

import { useRef } from 'react'

import Animated from './Animated.js'

export default function useAnimatedValue(initialValue, config) {
  const ref = useRef(null)
  if (ref.current == null) {
    ref.current = new Animated.Value(initialValue, config)
  }
  return ref.current
}
