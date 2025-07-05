/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { invariant } from '@tamagui/react-native-web-internals'
type FrameMetricProps = any

export type ViewToken = {
  item: any
  key: string
  index?: number | null
  isViewable: boolean
  section?: any
}

export type ViewabilityConfigCallbackPair = {
  viewabilityConfig: ViewabilityConfig
  onViewableItemsChanged: (info: {
    viewableItems: ViewToken[]
    changed: ViewToken[]
  }) => void
}

export type ViewabilityConfig = {
  /**
   * Minimum amount of time (in milliseconds) that an item must be physically viewable before the
   * viewability callback will be fired. A high number means that scrolling through content without
   * stopping will not mark the content as viewable.
   */
  minimumViewTime?: number

  /**
   * Percent of viewport that must be covered for a partially occluded item to count as
   * "viewable", 0-100. Fully visible items are always considered viewable. A value of 0 means
   * that a single pixel in the viewport makes the item viewable, and a value of 100 means that
   * an item must be either entirely visible or cover the entire viewport to count as viewable.
   */
  viewAreaCoveragePercentThreshold?: number

  /**
   * Similar to `viewAreaPercentThreshold`, but considers the percent of the item that is visible,
   * rather than the fraction of the viewable area it covers.
   */
  itemVisiblePercentThreshold?: number

  /**
   * Nothing is considered viewable until the user scrolls or `recordInteraction` is called after
   * render.
   */
  waitForInteraction?: boolean
}

/**
 * A Utility class for calculating viewable items based on current metrics like scroll position and
 * layout.
 */
class ViewabilityHelper {
  _config: ViewabilityConfig
  _hasInteracted: boolean = false
  _timers: Set<number> = new Set()
  _viewableIndices: number[] = []
  _viewableItems: Map<string, ViewToken> = new Map()

  constructor(config: ViewabilityConfig = { viewAreaCoveragePercentThreshold: 0 }) {
    this._config = config
  }

  /**
   * Cleanup, e.g. on unmount. Clears any pending timers.
   */
  dispose() {
    this._timers.forEach(clearTimeout)
  }

  /**
   * Determines which items are viewable based on the current metrics and config.
   */
  computeViewableItems(
    props: FrameMetricProps,
    scrollOffset: number,
    viewportHeight: number,
    getFrameMetrics: (
      index: number,
      props: FrameMetricProps
    ) => { length: number; offset: number } | null,
    renderRange?: { first: number; last: number }
  ): number[] {
    const itemCount = props.getItemCount(props.data)
    const { itemVisiblePercentThreshold, viewAreaCoveragePercentThreshold } = this._config
    const viewAreaMode = viewAreaCoveragePercentThreshold != null
    const viewablePercentThreshold = viewAreaMode
      ? viewAreaCoveragePercentThreshold
      : itemVisiblePercentThreshold
    invariant(
      viewablePercentThreshold != null &&
        (itemVisiblePercentThreshold != null) !==
          (viewAreaCoveragePercentThreshold != null),
      'Must set exactly one of itemVisiblePercentThreshold or viewAreaCoveragePercentThreshold'
    )
    const viewableIndices: number[] = []
    if (itemCount === 0) {
      return viewableIndices
    }
    let firstVisible = -1
    const { first, last } = renderRange || { first: 0, last: itemCount - 1 }
    if (last >= itemCount) {
      console.warn(
        'Invalid render range computing viewability ' +
          JSON.stringify({ renderRange, itemCount })
      )
      return []
    }
    for (let idx = first; idx <= last; idx++) {
      const metrics = getFrameMetrics(idx, props)
      if (!metrics) {
        continue
      }
      const top = metrics.offset - scrollOffset
      const bottom = top + metrics.length
      if (top < viewportHeight && bottom > 0) {
        firstVisible = idx
        if (
          _isViewable(
            viewAreaMode,
            viewablePercentThreshold!,
            top,
            bottom,
            viewportHeight,
            metrics.length
          )
        ) {
          viewableIndices.push(idx)
        }
      } else if (firstVisible >= 0) {
        break
      }
    }
    return viewableIndices
  }

  /**
   * Figures out which items are viewable and how that has changed from before and calls
   * `onViewableItemsChanged` as appropriate.
   */
  onUpdate(
    props: FrameMetricProps,
    scrollOffset: number,
    viewportHeight: number,
    getFrameMetrics: (
      index: number,
      props: FrameMetricProps
    ) => { length: number; offset: number } | null,
    createViewToken: (
      index: number,
      isViewable: boolean,
      props: FrameMetricProps
    ) => ViewToken,
    onViewableItemsChanged: (info: {
      viewableItems: ViewToken[]
      changed: ViewToken[]
    }) => void,
    renderRange?: { first: number; last: number }
  ): void {
    const itemCount = props.getItemCount(props.data)
    if (
      (this._config.waitForInteraction && !this._hasInteracted) ||
      itemCount === 0 ||
      !getFrameMetrics(0, props)
    ) {
      return
    }
    let viewableIndices: number[] = []
    if (itemCount) {
      viewableIndices = this.computeViewableItems(
        props,
        scrollOffset,
        viewportHeight,
        getFrameMetrics,
        renderRange
      )
    }
    if (
      this._viewableIndices.length === viewableIndices.length &&
      this._viewableIndices.every((v, ii) => v === viewableIndices[ii])
    ) {
      return
    }
    this._viewableIndices = viewableIndices
    if (this._config.minimumViewTime) {
      const handle = setTimeout(() => {
        this._timers.delete(handle as any)
        this._onUpdateSync(
          props,
          viewableIndices,
          onViewableItemsChanged,
          createViewToken
        )
      }, this._config.minimumViewTime)
      this._timers.add(handle as any)
    } else {
      this._onUpdateSync(props, viewableIndices, onViewableItemsChanged, createViewToken)
    }
  }

  resetViewableIndices() {
    this._viewableIndices = []
  }

  recordInteraction() {
    this._hasInteracted = true
  }

  _onUpdateSync(
    props: FrameMetricProps,
    viewableIndicesToCheck: number[],
    onViewableItemsChanged: (info: {
      changed: ViewToken[]
      viewableItems: ViewToken[]
    }) => void,
    createViewToken: (
      index: number,
      isViewable: boolean,
      props: FrameMetricProps
    ) => ViewToken
  ) {
    viewableIndicesToCheck = viewableIndicesToCheck.filter((ii) =>
      this._viewableIndices.includes(ii)
    )
    const prevItems = this._viewableItems
    const nextItems = new Map(
      viewableIndicesToCheck.map((ii) => {
        const viewable = createViewToken(ii, true, props)
        return [viewable.key, viewable]
      })
    )

    const changed: ViewToken[] = []
    for (const [key, viewable] of nextItems) {
      if (!prevItems.has(key)) {
        changed.push(viewable)
      }
    }
    for (const [key, viewable] of prevItems) {
      if (!nextItems.has(key)) {
        changed.push({ ...viewable, isViewable: false })
      }
    }
    if (changed.length > 0) {
      this._viewableItems = nextItems
      onViewableItemsChanged({
        viewableItems: Array.from(nextItems.values()),
        changed,
      })
    }
  }
}

function _isViewable(
  viewAreaMode: boolean,
  viewablePercentThreshold: number,
  top: number,
  bottom: number,
  viewportHeight: number,
  itemLength: number
): boolean {
  if (_isEntirelyVisible(top, bottom, viewportHeight)) {
    return true
  } else {
    const pixels = _getPixelsVisible(top, bottom, viewportHeight)
    const percent = 100 * (viewAreaMode ? pixels / viewportHeight : pixels / itemLength)
    return percent >= viewablePercentThreshold
  }
}

function _getPixelsVisible(top: number, bottom: number, viewportHeight: number): number {
  const visibleHeight = Math.min(bottom, viewportHeight) - Math.max(top, 0)
  return Math.max(0, visibleHeight)
}

function _isEntirelyVisible(
  top: number,
  bottom: number,
  viewportHeight: number
): boolean {
  return top >= 0 && bottom <= viewportHeight && bottom > top
}

export default ViewabilityHelper
