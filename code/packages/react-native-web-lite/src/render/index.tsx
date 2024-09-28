/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @noflow
 */

import {
  hydrate as domLegacyHydrate,
  render as domLegacyRender,
  unmountComponentAtNode,
} from 'react-dom'
import {
  createRoot as domCreateRoot,
  hydrateRoot as domHydrateRoot,
} from 'react-dom/client'

export function hydrate(element, root) {
  return domHydrateRoot(root, element)
}

export function render(element, root) {
  const reactRoot = domCreateRoot(root)
  reactRoot.render(element)
  return reactRoot
}

export function hydrateLegacy(element, root, callback) {
  domLegacyHydrate(element, root, callback)
  return {
    unmount: function () {
      return unmountComponentAtNode(root)
    },
  }
}

export default function renderLegacy(element, root, callback) {
  domLegacyRender(element, root, callback)
  return {
    unmount: function () {
      return unmountComponentAtNode(root)
    },
  }
}
