/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export const isWebColor = (color: string): boolean =>
  color === 'currentcolor' ||
  color === 'currentColor' ||
  color === 'inherit' ||
  color.startsWith('var(')
