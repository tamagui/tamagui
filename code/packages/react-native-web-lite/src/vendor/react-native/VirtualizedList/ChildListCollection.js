/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */

import { invariant } from '@tamagui/react-native-web-internals'

class ChildListCollection {
  _cellKeyToChildren = new Map()
  _childrenToCellKey = new Map()

  add(list, cellKey) {
    invariant(
      !this._childrenToCellKey.has(list),
      'Trying to add already present child list'
    )

    const cellLists = this._cellKeyToChildren.get(cellKey) ?? new Set()
    cellLists.add(list)
    this._cellKeyToChildren.set(cellKey, cellLists)

    this._childrenToCellKey.set(list, cellKey)
  }

  remove(list) {
    const cellKey = this._childrenToCellKey.get(list)
    invariant(cellKey != null, 'Trying to remove non-present child list')
    this._childrenToCellKey.delete(list)

    const cellLists = this._cellKeyToChildren.get(cellKey)
    invariant(cellLists, '_cellKeyToChildren should contain cellKey')
    cellLists.delete(list)

    if (cellLists.size === 0) {
      this._cellKeyToChildren.delete(cellKey)
    }
  }

  forEach(fn) {
    for (const listSet of this._cellKeyToChildren.values()) {
      for (const list of listSet) {
        fn(list)
      }
    }
  }

  forEachInCell(cellKey, fn) {
    const listSet = this._cellKeyToChildren.get(cellKey) ?? []
    for (const list of listSet) {
      fn(list)
    }
  }

  anyInCell(cellKey, fn) {
    const listSet = this._cellKeyToChildren.get(cellKey) ?? []
    for (const list of listSet) {
      if (fn(list)) {
        return true
      }
    }
    return false
  }

  size() {
    return this._childrenToCellKey.size
  }
}

export { ChildListCollection }
export default ChildListCollection
