/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

import type * as React from 'react'

export function mergeRefs(
  ...args: ReadonlyArray<React.Ref<any>>
): (node: HTMLElement | null) => void {
  return function forwardRef(node: HTMLElement | null) {
    args.forEach((ref: React.Ref<any>) => {
      if (ref == null) {
        return
      }
      if (typeof ref === 'function') {
        ref(node)
        return
      }
      if (typeof ref === 'object') {
        // @ts-ignore
        ref.current = node
        return
      }
      console.error(
        `mergeRefs cannot handle Refs of type boolean, number or string, received ref ${String(
          ref
        )}`
      )
    })
  }
}
