/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */

import VirtualizedList from '../VirtualizedList'

import * as React from 'react'
import { useContext, useMemo } from 'react'

const __DEV__ = process.env.NODE_ENV !== 'production'

const defaultContext = {
  cellKey: null,
  getScrollMetrics: () => ({
    contentLength: 0,
    dOffset: 0,
    dt: 0,
    offset: 0,
    timestamp: 0,
    velocity: 0,
    visibleLength: 0,
    zoomScale: 1,
  }),
  horizontal: false,
  getOutermostParentListRef: () => null,
  registerAsNestedChild: (params) => {},
  unregisterAsNestedChild: (params) => {},
}

export const VirtualizedListContext = React.createContext(null)
if (__DEV__) {
  VirtualizedListContext.displayName = 'VirtualizedListContext'
}

/**
 * Resets the context. Intended for use by portal-like components (e.g. Modal).
 */
export function VirtualizedListContextResetter({ children }) {
  return (
    <VirtualizedListContext.Provider value={null}>
      {children}
    </VirtualizedListContext.Provider>
  )
}

/**
 * Sets the context with memoization. Intended to be used by `VirtualizedList`.
 */
export function VirtualizedListContextProvider({ children, value }) {
  // Avoid setting a newly created context object if the values are identical.
  const context = useMemo(
    () => ({
      cellKey: null,
      getScrollMetrics: value.getScrollMetrics,
      horizontal: value.horizontal,
      getOutermostParentListRef: value.getOutermostParentListRef,
      registerAsNestedChild: value.registerAsNestedChild,
      unregisterAsNestedChild: value.unregisterAsNestedChild,
    }),
    [
      value.getScrollMetrics,
      value.horizontal,
      value.getOutermostParentListRef,
      value.registerAsNestedChild,
      value.unregisterAsNestedChild,
    ]
  )
  return (
    <VirtualizedListContext.Provider value={context}>
      {children}
    </VirtualizedListContext.Provider>
  )
}

/**
 * Sets the `cellKey`. Intended to be used by `VirtualizedList` for each cell.
 */
export function VirtualizedListCellContextProvider({ cellKey, children }) {
  // Avoid setting a newly created context object if the values are identical.
  const currContext = useContext(VirtualizedListContext)
  const context = useMemo(
    () => (currContext == null ? null : { ...currContext, cellKey }),
    [currContext, cellKey]
  )
  return (
    <VirtualizedListContext.Provider value={context}>
      {children}
    </VirtualizedListContext.Provider>
  )
}
