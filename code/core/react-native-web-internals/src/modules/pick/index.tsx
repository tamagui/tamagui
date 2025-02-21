/**
 * Copyright (c) Nicolas Gallagher.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

export default function pick(
  obj: Object,
  list: {
    [K in string]: boolean
  }
): Object {
  const nextObj = {}
  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      if (list[key] === true) {
        nextObj[key] = obj[key]
      }
    }
  }
  return nextObj
}
