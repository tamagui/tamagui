/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 */

import canUseDOM from '../../modules/canUseDOM'

// @ts-ignore : HTMLStyleElement is incorrectly typed - https://github.com/facebook/flow/issues/2696
export default function createCSSStyleSheet(
  id: string,
  rootNode?: Document | ShadowRoot,
  textContent?: string
): CSSStyleSheet | null {

  if (canUseDOM) {
    const root = rootNode != null ? rootNode : document
    let element = root.getElementById(id)
    if (element == null) {
      element = document.createElement('style')
      element.setAttribute('id', id)
      if (typeof textContent === 'string') {
        element.appendChild(document.createTextNode(textContent))
      }
      if (root instanceof ShadowRoot) {
        root.insertBefore(element, root.firstChild)
      } else {
        const head = root.head
        if (head) {
          // append fixes remix SSR hydration because react goes in-order and prepend messes up order
          head.appendChild(element)
        }
      }
    }
    // @ts-ignore : HTMLElement is incorrectly typed
    return element.sheet
  } else {
    return null
  }
}
