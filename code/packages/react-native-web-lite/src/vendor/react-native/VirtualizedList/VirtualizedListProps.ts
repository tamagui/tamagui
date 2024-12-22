/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import type ScrollView from '../../../ScrollView'
import type { LayoutEvent } from '../../../types'
import type { ViewProps } from '../../../View'
import type {
  ViewabilityConfig,
  ViewabilityConfigCallbackPair,
  ViewToken,
} from '../ViewabilityHelper'

export type Item = any

export type Separators = {
  highlight: () => void
  unhighlight: () => void
  updateProps: (select: 'leading' | 'trailing', newProps: object) => void
}

export type RenderItemProps<ItemT> = {
  item: ItemT
  index: number
  separators: Separators
}

export type CellRendererProps<ItemT> = Readonly<{
  cellKey: string
  children: React.ReactNode
  index: number
  item: ItemT
  onFocusCapture?: (event: FocusEvent) => void
  onLayout?: (event: LayoutEvent) => void
  style: ViewProps['style']
}>

export type RenderItemType<ItemT> = (info: RenderItemProps<ItemT>) => React.ReactNode

type RequiredProps = {
  /**
   * The default accessor functions assume this is an Array<{key: string} | {id: string}> but you can override
   * getItem, getItemCount, and keyExtractor to handle any type of index-based data.
   */
  data?: any
  /**
   * A generic accessor for extracting an item from any sort of data blob.
   */
  getItem: (data: any, index: number) => Item | undefined
  /**
   * Determines how many items are in the data blob.
   */
  getItemCount: (data: any) => number
}

type OptionalProps = {
  renderItem?: RenderItemType<Item> | null
  debug?: boolean | null
  disableVirtualization?: boolean | null
  extraData?: any
  getItemLayout?: (
    data: any,
    index: number
  ) => {
    length: number
    offset: number
    index: number
  }
  horizontal?: boolean | null
  initialNumToRender?: number | null
  initialScrollIndex?: number | null
  inverted?: boolean | null
  keyExtractor?: (item: Item, index: number) => string | null
  CellRendererComponent?: React.ComponentType<CellRendererProps<Item>> | null
  ItemSeparatorComponent?: React.ComponentType<any> | null
  ListItemComponent?: React.ComponentType<any> | React.ReactElement | null
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null
  ListFooterComponentStyle?: ViewProps['style']
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null
  ListHeaderComponentStyle?: ViewProps['style']
  maxToRenderPerBatch?: number | null
  onEndReached?: ((info: { distanceFromEnd: number }) => void) | null
  onEndReachedThreshold?: number | null
  onRefresh?: (() => void) | null
  onScrollToIndexFailed?:
    | ((info: {
        index: number
        highestMeasuredFrameIndex: number
        averageItemLength: number
      }) => void)
    | null
  onStartReached?: ((info: { distanceFromStart: number }) => void) | null
  onStartReachedThreshold?: number | null
  onViewableItemsChanged?:
    | ((info: {
        viewableItems: ViewToken[]
        changed: ViewToken[]
      }) => void)
    | null
  persistentScrollbar?: boolean | null
  progressViewOffset?: number
  refreshControl?: React.ReactElement | null
  refreshing?: boolean | null
  removeClippedSubviews?: boolean
  renderScrollComponent?: (props: object) => React.ReactElement
  updateCellsBatchingPeriod?: number | null
  viewabilityConfig?: ViewabilityConfig
  viewabilityConfigCallbackPairs?: ViewabilityConfigCallbackPair[]
  windowSize?: number | null
  legacyImplementation?: never
}

export type Props = React.ComponentProps<typeof ScrollView> &
  RequiredProps &
  OptionalProps

/**
 * Subset of properties needed to calculate frame metrics
 */
export type FrameMetricProps = {
  data: RequiredProps['data']
  getItemCount: RequiredProps['getItemCount']
  getItem: RequiredProps['getItem']
  getItemLayout?: OptionalProps['getItemLayout']
  keyExtractor?: OptionalProps['keyExtractor']
}
