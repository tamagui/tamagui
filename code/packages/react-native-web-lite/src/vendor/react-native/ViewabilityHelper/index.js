/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */

'use strict'

import { invariant } from '@tamagui/react-native-web-internals'

/**
 * A Utility class for calculating viewable items based on current metrics like scroll position and
 * layout.
 *
 * An item is said to be in a "viewable" state when any of the following
 * is true for longer than `minimumViewTime` milliseconds (after an interaction if `waitForInteraction`
 * is true):
 *
 * - Occupying >= `viewAreaCoveragePercentThreshold` of the view area XOR fraction of the item
 *   visible in the view area >= `itemVisiblePercentThreshold`.
 * - Entirely visible on screen
 */
class ViewabilityHelper {
  _config
  _hasInteracted = false
  _timers = new Set()
  _viewableIndices = []
  _viewableItems = new Map()

  constructor(config = { viewAreaCoveragePercentThreshold: 0 }) {
    this._config = config
  }

  /**
   * Cleanup, e.g. on unmount. Clears any pending timers.
   */
  dispose() {
    /* $FlowFixMe[incompatible-call] (>=0.63.0 site=react_native_fb) This
     * comment suppresses an error found when Flow v0.63 was deployed. To see
     * the error delete this comment and run Flow. */
    this._timers.forEach(clearTimeout)
  }

  /**
   * Determines which items are viewable based on the current metrics and config.
   */
  computeViewableItems(
    props,
    scrollOffset,
    viewportHeight,
    getFrameMetrics,
    // Optional optimization to reduce the scan size
    renderRange
  ) {
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
    const viewableIndices = []
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
            viewablePercentThreshold,
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
    props,
    scrollOffset,
    viewportHeight,
    getFrameMetrics,
    createViewToken,
    onViewableItemsChanged,
    // Optional optimization to reduce the scan size
    renderRange
  ) {
    const itemCount = props.getItemCount(props.data)
    if (
      (this._config.waitForInteraction && !this._hasInteracted) ||
      itemCount === 0 ||
      !getFrameMetrics(0, props)
    ) {
      return
    }
    let viewableIndices = []
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
      // We might get a lot of scroll events where visibility doesn't change and we don't want to do
      // extra work in those cases.
      return
    }
    this._viewableIndices = viewableIndices
    if (this._config.minimumViewTime) {
      const handle = setTimeout(() => {
        /* $FlowFixMe[incompatible-call] (>=0.63.0 site=react_native_fb) This
         * comment suppresses an error found when Flow v0.63 was deployed. To
         * see the error delete this comment and run Flow. */
        this._timers.delete(handle)
        this._onUpdateSync(
          props,
          viewableIndices,
          onViewableItemsChanged,
          createViewToken
        )
      }, this._config.minimumViewTime)
      /* $FlowFixMe[incompatible-call] (>=0.63.0 site=react_native_fb) This
       * comment suppresses an error found when Flow v0.63 was deployed. To see
       * the error delete this comment and run Flow. */
      this._timers.add(handle)
    } else {
      this._onUpdateSync(props, viewableIndices, onViewableItemsChanged, createViewToken)
    }
  }

  /**
   * clean-up cached _viewableIndices to evaluate changed items on next update
   */
  resetViewableIndices() {
    this._viewableIndices = []
  }

  /**
   * Records that an interaction has happened even if there has been no scroll.
   */
  recordInteraction() {
    this._hasInteracted = true
  }

  _onUpdateSync(props, viewableIndicesToCheck, onViewableItemsChanged, createViewToken) {
    // Filter out indices that have gone out of view since this call was scheduled.
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

    const changed = []
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
        viewabilityConfig: this._config,
      })
    }
  }
}

function _isViewable(
  viewAreaMode,
  viewablePercentThreshold,
  top,
  bottom,
  viewportHeight,
  itemLength
) {
  if (_isEntirelyVisible(top, bottom, viewportHeight)) {
    return true
  } else {
    const pixels = _getPixelsVisible(top, bottom, viewportHeight)
    const percent = 100 * (viewAreaMode ? pixels / viewportHeight : pixels / itemLength)
    return percent >= viewablePercentThreshold
  }
}

function _getPixelsVisible(top, bottom, viewportHeight) {
  const visibleHeight = Math.min(bottom, viewportHeight) - Math.max(top, 0)
  return Math.max(0, visibleHeight)
}

function _isEntirelyVisible(top, bottom, viewportHeight) {
  return top >= 0 && bottom <= viewportHeight && bottom > top
}

export default ViewabilityHelper
