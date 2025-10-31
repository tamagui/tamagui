/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 */

export const getBoundingClientRect = (node: HTMLElement | null): void | ClientRect => {
  if (node != null) {
    const isElement = node.nodeType === 1 /* Node.ELEMENT_NODE */
    if (isElement && typeof node.getBoundingClientRect === 'function') {
      return node.getBoundingClientRect()
    }
  }
}
