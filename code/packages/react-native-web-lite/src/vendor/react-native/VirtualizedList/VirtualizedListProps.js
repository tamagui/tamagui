/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const defaultVirtualizedListProps = {
  debug: false,
  disableVirtualization: false,
  extraData: null,
  getItemLayout: null,
  horizontal: false,
  initialNumToRender: 10,
  initialScrollIndex: null,
  inverted: false,
  keyExtractor: null,
  CellRendererComponent: null,
  ItemSeparatorComponent: null,
  ListItemComponent: null,
  ListEmptyComponent: null,
  ListFooterComponent: null,
  ListFooterComponentStyle: null,
  ListHeaderComponent: null,
  ListHeaderComponentStyle: null,
  maxToRenderPerBatch: 10,
  onEndReached: null,
  onEndReachedThreshold: 2,
  onRefresh: null,
  onScrollToIndexFailed: null,
  onStartReached: null,
  onStartReachedThreshold: 2,
  onViewableItemsChanged: null,
  persistentScrollbar: false,
  progressViewOffset: 0,
  refreshControl: null,
  refreshing: false,
  removeClippedSubviews: false,
  renderScrollComponent: null,
  updateCellsBatchingPeriod: 50,
  viewabilityConfig: null,
  viewabilityConfigCallbackPairs: null,
  windowSize: 21,
}

export default defaultVirtualizedListProps
