/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { ScrollEvent } from '../Types/CoreEventTypes'
import { defaultVirtualizedListProps } from './VirtualizedListProps'

import RefreshControl from '../../../exports/RefreshControl'
import ScrollView from '../../../exports/ScrollView'
import View from '../../../exports/View'
import StyleSheet from '../../../exports/StyleSheet'

import Batchinator from '../Batchinator'
import clamp from '../Utilities/clamp'
import infoLog from '../infoLog'
import { CellRenderMask } from './CellRenderMask'
import ChildListCollection from './ChildListCollection'
import FillRateHelper from '../FillRateHelper'
import StateSafePureComponent from './StateSafePureComponent'
import ViewabilityHelper from '../ViewabilityHelper'
import CellRenderer from './VirtualizedListCellRenderer'
import {
  VirtualizedListCellContextProvider,
  VirtualizedListContext,
  VirtualizedListContextProvider,
} from './VirtualizedListContext.jsx'
import {
  computeWindowedRenderLimits,
  keyExtractor as defaultKeyExtractor,
} from '../VirtualizeUtils'
import invariant from 'fbjs/lib/invariant'
import nullthrows from 'nullthrows'
import * as React from 'react'

const __DEV__ = process.env.NODE_ENV !== 'production'

const ON_EDGE_REACHED_EPSILON = 0.001

let _usedIndexForKey = false
let _keylessItemComponentName = ''

const defaultViewabilityConfig = {
  viewabilityHelper: null,
  onViewableItemsChanged: null,
}

const defaultRenderMask = {
  renderMask: null,
  cellsAroundViewport: { first: 0, last: 0 },
}

// Default Props Helper Functions
function horizontalOrDefault(horizontal) {
  return horizontal ?? false
}

function initialNumToRenderOrDefault(initialNumToRender) {
  return initialNumToRender ?? 10
}

function maxToRenderPerBatchOrDefault(maxToRenderPerBatch) {
  return maxToRenderPerBatch ?? 10
}

function onStartReachedThresholdOrDefault(onStartReachedThreshold) {
  return onStartReachedThreshold ?? 2
}

function onEndReachedThresholdOrDefault(onEndReachedThreshold) {
  return onEndReachedThreshold ?? 2
}

function getScrollingThreshold(threshold, visibleLength) {
  return (threshold * visibleLength) / 2
}

function scrollEventThrottleOrDefault(scrollEventThrottle) {
  return scrollEventThrottle ?? 50
}

function windowSizeOrDefault(windowSize) {
  return windowSize ?? 21
}

function findLastWhere(arr, predicate) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      return arr[i]
    }
  }
  return null
}

class VirtualizedList extends StateSafePureComponent {
  static contextType = VirtualizedListContext

  scrollToEnd(params) {
    const animated = params ? params.animated : true
    const veryLast = this.props.getItemCount(this.props.data) - 1
    if (veryLast < 0) {
      return
    }
    const frame = this.__getFrameMetricsApprox(veryLast, this.props)
    const offset = Math.max(
      0,
      frame.offset +
        frame.length +
        this._footerLength -
        this._scrollMetrics.visibleLength
    )

    if (this._scrollRef == null) {
      return
    }

    if (this._scrollRef.scrollTo == null) {
      console.warn(
        'No scrollTo method provided. This may be because you have two nested ' +
          'VirtualizedLists with the same orientation, or because you are ' +
          'using a custom component that does not implement scrollTo.'
      )
      return
    }

    this._scrollRef.scrollTo(
      horizontalOrDefault(this.props.horizontal)
        ? { x: offset, animated }
        : { y: offset, animated }
    )
  }

  scrollToIndex(params) {
    const {
      data,
      horizontal,
      getItemCount,
      getItemLayout,
      onScrollToIndexFailed,
    } = this.props
    const { animated, index, viewOffset, viewPosition } = params
    invariant(
      index >= 0,
      `scrollToIndex out of range: requested index ${index} but minimum is 0`
    )
    invariant(
      getItemCount(data) >= 1,
      `scrollToIndex out of range: item length ${getItemCount(
        data
      )} but minimum is 1`
    )
    invariant(
      index < getItemCount(data),
      `scrollToIndex out of range: requested index ${index} is out of 0 to ${
        getItemCount(data) - 1
      }`
    )
    if (!getItemLayout && index > this._highestMeasuredFrameIndex) {
      invariant(
        !!onScrollToIndexFailed,
        'scrollToIndex should be used in conjunction with getItemLayout or onScrollToIndexFailed, ' +
          'otherwise there is no way to know the location of offscreen indices or handle failures.'
      )
      onScrollToIndexFailed({
        averageItemLength: this._averageCellLength,
        highestMeasuredFrameIndex: this._highestMeasuredFrameIndex,
        index,
      })
      return
    }
    const frame = this.__getFrameMetricsApprox(Math.floor(index), this.props)
    const offset =
      Math.max(
        0,
        this._getOffsetApprox(index, this.props) -
          (viewPosition || 0) *
            (this._scrollMetrics.visibleLength - frame.length)
      ) - (viewOffset || 0)

    if (this._scrollRef == null) {
      return
    }

    this._scrollRef.scrollTo(
      horizontalOrDefault(horizontal)
        ? { x: offset, animated }
        : { y: offset, animated }
    )
  }

  scrollToItem(params) {
    const { data, getItem, getItemCount, horizontal, onScrollToIndexFailed } =
      this.props
    const { animated, item, viewPosition, viewOffset } = params
    const index = getItem(data, item)
    if (index != null) {
      this.scrollToIndex({
        animated,
        index,
        viewOffset,
        viewPosition,
      })
    } else if (getItem(data, index) === item) {
      this.scrollToIndex({
        animated,
        index,
        viewOffset,
        viewPosition,
      })
    } else {
      const itemCount = getItemCount(data)
      for (let i = 0; i < itemCount; i++) {
        if (getItem(data, i) === item) {
          this.scrollToIndex({
            animated,
            index: i,
            viewOffset,
            viewPosition,
          })
          break
        }
      }
    }
  }

  scrollToOffset(params) {
    const { animated, offset, viewPosition } = params
    if (this._scrollRef == null) {
      return
    }
    this._scrollRef.scrollTo(
      horizontalOrDefault(this.props.horizontal)
        ? { x: offset, animated }
        : { y: offset, animated }
    )
  }

  recordInteraction() {
    this._nestedChildLists.forEach((childList) => {
      childList.recordInteraction()
    })
    this._viewabilityTuples.forEach((viewabilityTuple) => {
      viewabilityTuple.viewabilityHelper.recordInteraction()
    })
  }

  flashScrollIndicators() {
    if (this._scrollRef && this._scrollRef.flashScrollIndicators) {
      this._scrollRef.flashScrollIndicators()
    }
  }

  getScrollResponder() {
    if (this._scrollRef && this._scrollRef.getScrollResponder) {
      return this._scrollRef.getScrollResponder()
    }
  }

  getScrollableNode() {
    if (this._scrollRef && this._scrollRef.getScrollableNode) {
      return this._scrollRef.getScrollableNode()
    }
  }

  getScrollRef() {
    return this._scrollRef
  }

  setNativeProps(props) {
    if (this._scrollRef) {
      this._scrollRef.setNativeProps(props)
    }
  }

  render() {
    const {
      ListEmptyComponent,
      ListFooterComponent,
      ListHeaderComponent,
      data,
      debug,
      disableVirtualization,
      getItem,
      getItemCount,
      getItemLayout,
      horizontal,
      keyExtractor,
      numColumns,
      onEndReached,
      onEndReachedThreshold,
      onLayout,
      onRefresh,
      onScroll,
      onScrollBeginDrag,
      onScrollEndDrag,
      onMomentumScrollBegin,
      onMomentumScrollEnd,
      onStartReached,
      onStartReachedThreshold,
      onViewableItemsChanged,
      refreshing,
      removeClippedSubviews,
      renderItem,
      viewabilityConfig,
      viewabilityConfigCallbackPairs,
      ...restProps
    } = this.props

    const isVirtualizationDisabled = disableVirtualization
    const itemCount = getItemCount(data)

    if (itemCount === 0) {
      return ListEmptyComponent ? <ListEmptyComponent /> : null
    }

    return (
      <ScrollView
        {...restProps}
        ref={this._captureRef}
        onContentSizeChange={this._onContentSizeChange}
        onLayout={this._onLayout}
        onScroll={this._onScroll}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        onMomentumScrollBegin={onMomentumScrollBegin}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={scrollEventThrottleOrDefault(
          this.props.scrollEventThrottle
        )}
        removeClippedSubviews={removeClippedSubviews}
        style={[styles.base, this.props.style]}
        contentContainerStyle={this.props.contentContainerStyle}
        onRefresh={onRefresh}
        refreshing={refreshing}
        horizontal={horizontalOrDefault(horizontal)}
      >
        {this._renderChildren()}
      </ScrollView>
    )
  }

  _renderChildren() {
    const { data, getItem, getItemCount, renderItem } = this.props
    const itemCount = getItemCount(data)
    const items = []

    for (let i = 0; i < itemCount; i++) {
      const item = getItem(data, i)
      if (item != null) {
        items.push(renderItem({ item, index: i }))
      }
    }

    return items
  }

  _captureRef = (ref) => {
    this._scrollRef = ref
  }

  _onContentSizeChange = (width, height) => {
    if (this.props.onContentSizeChange) {
      this.props.onContentSizeChange(width, height)
    }
  }

  _onLayout = (event) => {
    if (this.props.onLayout) {
      this.props.onLayout(event)
    }
  }

  _onScroll = (event) => {
    if (this.props.onScroll) {
      this.props.onScroll(event)
    }
  }

  __getFrameMetricsApprox(index, props) {
    return {
      length: 50,
      offset: index * 50,
      index,
    }
  }

  _getOffsetApprox(index, props) {
    return index * 50
  }
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
})

export default VirtualizedList 
