// @ts-nocheck
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { invariant, Platform } from '@tamagui/react-native-web-internals'
import memoizeOne from 'memoize-one'
import React from 'react'
import deepDiffer from './vendor/react-native/deepDiffer'
import type { ViewabilityConfigCallbackPair } from './vendor/react-native/ViewabilityHelper'
import type { RenderItemType } from './vendor/react-native/VirtualizedList'
import VirtualizedList from './vendor/react-native/VirtualizedList'
import type { ViewProps } from './View'
import { keyExtractor as defaultKeyExtractor } from './vendor/react-native/VirtualizeUtils'
import View from './View'

type ScrollViewNativeComponent = any
type ViewStyleProp = ViewProps['style']

type RequiredProps<ItemT> = {
  /**
   * An array (or array-like list) of items to render. Other data types can be
   * used by targeting VirtualizedList directly.
   */
  data?: ArrayLike<ItemT> | null
}

type OptionalProps<ItemT> = {
  /**
   * Takes an item from `data` and renders it into the list.
   */
  renderItem?: RenderItemType<ItemT> | null

  /**
   * Optional custom style for multi-item rows generated when numColumns > 1.
   */
  columnWrapperStyle?: ViewStyleProp

  extraData?: any

  getItemLayout?: (
    data: ArrayLike<ItemT> | null,
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
  keyExtractor?: (item: ItemT, index: number) => string | null
  numColumns?: number
  removeClippedSubviews?: boolean
  fadingEdgeLength?: number | null
  strictMode?: boolean
}

function removeClippedSubviewsOrDefault(removeClippedSubviews?: boolean | null) {
  return removeClippedSubviews ?? Platform.OS === 'android'
}

function numColumnsOrDefault(numColumns?: number | null) {
  return numColumns ?? 1
}

function isArrayLike(data: unknown): boolean {
  return typeof Object(data).length === 'number'
}

type FlatListProps<ItemT> = RequiredProps<ItemT> & OptionalProps<ItemT>

type VirtualizedListProps = React.ComponentProps<typeof VirtualizedList>

export type Props<ItemT> = Omit<
  VirtualizedListProps,
  'getItem' | 'getItemCount' | 'getItemLayout' | 'renderItem' | 'keyExtractor'
> &
  FlatListProps<ItemT>

/**
 * A performant interface for rendering simple, flat lists, supporting the most handy features.
 */
class FlatList<ItemT> extends React.PureComponent<Props<ItemT>> {
  props: Props<ItemT>
  _listRef: React.RefObject<VirtualizedList> | null = null
  _virtualizedListPairs: Array<ViewabilityConfigCallbackPair> = []

  constructor(props: Props<ItemT>) {
    super(props)
    this.props = props
    this._checkProps(this.props)
    if (this.props.viewabilityConfigCallbackPairs) {
      this._virtualizedListPairs = this.props.viewabilityConfigCallbackPairs.map(
        (pair) => ({
          viewabilityConfig: pair.viewabilityConfig,
          onViewableItemsChanged: this._createOnViewableItemsChanged(
            pair.onViewableItemsChanged
          ),
        })
      )
    } else if (this.props.onViewableItemsChanged) {
      this._virtualizedListPairs.push({
        viewabilityConfig: this.props.viewabilityConfig!,
        onViewableItemsChanged: this._createOnViewableItemsChanged(
          this.props.onViewableItemsChanged
        ),
      })
    }
  }

  componentDidUpdate(prevProps: Props<ItemT>) {
    invariant(
      prevProps.numColumns === this.props.numColumns,
      'Changing numColumns on the fly is not supported. Change the key prop on FlatList when ' +
        'changing the number of columns to force a fresh render of the component.'
    )
    invariant(
      prevProps.onViewableItemsChanged === this.props.onViewableItemsChanged,
      'Changing onViewableItemsChanged on the fly is not supported'
    )
    invariant(
      !deepDiffer(prevProps.viewabilityConfig, this.props.viewabilityConfig),
      'Changing viewabilityConfig on the fly is not supported'
    )
    invariant(
      prevProps.viewabilityConfigCallbackPairs ===
        this.props.viewabilityConfigCallbackPairs,
      'Changing viewabilityConfigCallbackPairs on the fly is not supported'
    )

    this._checkProps(this.props)
  }

  _captureRef = (ref: React.RefObject<VirtualizedList> | null) => {
    this._listRef = ref
  }

  _checkProps(props: Props<ItemT>) {
    const {
      getItem,
      getItemCount,
      horizontal,
      columnWrapperStyle,
      onViewableItemsChanged,
      viewabilityConfigCallbackPairs,
    } = props
    const numColumns = numColumnsOrDefault(this.props.numColumns)
    invariant(!getItem && !getItemCount, 'FlatList does not support custom data formats.')
    if (numColumns > 1) {
      invariant(!horizontal, 'numColumns does not support horizontal.')
    } else {
      invariant(
        !columnWrapperStyle,
        'columnWrapperStyle not supported for single column lists'
      )
    }
    invariant(
      !(onViewableItemsChanged && viewabilityConfigCallbackPairs),
      'FlatList does not support setting both onViewableItemsChanged and viewabilityConfigCallbackPairs.'
    )
  }

  _getItem = (data: ArrayLike<ItemT>, index: number): ItemT | ItemT[] | null => {
    const numColumns = numColumnsOrDefault(this.props.numColumns)
    if (numColumns > 1) {
      const ret = []
      for (let kk = 0; kk < numColumns; kk++) {
        const itemIndex = index * numColumns + kk
        if (itemIndex < data.length) {
          const item = data[itemIndex]
          ret.push(item)
        }
      }
      return ret
    } else {
      return data[index]
    }
  }

  _getItemCount = (data: ArrayLike<ItemT> | null): number => {
    if (data != null && isArrayLike(data)) {
      const numColumns = numColumnsOrDefault(this.props.numColumns)
      return numColumns > 1 ? Math.ceil(data.length / numColumns) : data.length
    } else {
      return 0
    }
  }

  _keyExtractor = (items: ItemT | ItemT[], index: number): string => {
    const numColumns = numColumnsOrDefault(this.props.numColumns)
    const keyExtractor = this.props.keyExtractor ?? defaultKeyExtractor

    if (numColumns > 1) {
      invariant(
        Array.isArray(items),
        'FlatList: Expected each item to be an array with multiple columns.'
      )
      return items
        .map((item, kk) => keyExtractor(item, index * numColumns + kk))
        .join(':')
    }

    return keyExtractor(items, index)
  }

  _pushMultiColumnViewable(arr: Array<ViewToken>, v: ViewToken): void {
    const numColumns = numColumnsOrDefault(this.props.numColumns)
    const keyExtractor = this.props.keyExtractor ?? defaultKeyExtractor
    v.item.forEach((item, ii) => {
      invariant(v.index != null, 'Missing index!')
      const index = v.index * numColumns + ii
      arr.push({ ...v, item, key: keyExtractor(item, index), index })
    })
  }

  _createOnViewableItemsChanged(
    onViewableItemsChanged:
      | ((info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void)
      | null
  ) {
    return (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      const numColumns = numColumnsOrDefault(this.props.numColumns)
      if (onViewableItemsChanged) {
        if (numColumns > 1) {
          const changed: ViewToken[] = []
          const viewableItems: ViewToken[] = []
          info.viewableItems.forEach((v) =>
            this._pushMultiColumnViewable(viewableItems, v)
          )
          info.changed.forEach((v) => this._pushMultiColumnViewable(changed, v))
          onViewableItemsChanged({ viewableItems, changed })
        } else {
          onViewableItemsChanged(info)
        }
      }
    }
  }

  _renderer = (
    ListItemComponent: React.ComponentType<any> | React.ReactElement<any> | null,
    renderItem: RenderItemType<ItemT> | null,
    columnWrapperStyle: ViewStyleProp | null,
    numColumns: number | null,
    extraData: any
  ) => {
    const cols = numColumnsOrDefault(numColumns)

    const render = (props: RenderItemProps<ItemT>): React.ReactNode => {
      if (ListItemComponent) {
        return <ListItemComponent {...props} />
      } else if (renderItem) {
        return renderItem(props)
      } else {
        return null
      }
    }

    const renderProp = (info: RenderItemProps<ItemT>) => {
      if (cols > 1) {
        const { item, index } = info
        invariant(Array.isArray(item), 'Expected array of items with numColumns > 1')
        return (
          <View style={[styles.row, columnWrapperStyle]}>
            {item.map((it, kk) => {
              const element = render({
                item: it,
                index: index * cols + kk,
                separators: info.separators,
              })
              return element != null ? (
                <React.Fragment key={kk}>{element}</React.Fragment>
              ) : null
            })}
          </View>
        )
      } else {
        return render(info)
      }
    }

    return ListItemComponent
      ? { ListItemComponent: renderProp }
      : { renderItem: renderProp }
  }

  _memoizedRenderer = memoizeOne(this._renderer)

  render(): React.ReactNode {
    const {
      numColumns,
      columnWrapperStyle,
      removeClippedSubviews: _removeClippedSubviews,
      strictMode = false,
      ...restProps
    } = this.props

    const renderer = strictMode ? this._memoizedRenderer : this._renderer

    return (
      <VirtualizedList
        {...restProps}
        getItem={this._getItem}
        getItemCount={this._getItemCount}
        keyExtractor={this._keyExtractor}
        ref={this._captureRef}
        viewabilityConfigCallbackPairs={this._virtualizedListPairs}
        removeClippedSubviews={removeClippedSubviewsOrDefault(_removeClippedSubviews)}
        {...renderer(
          this.props.ListItemComponent,
          this.props.renderItem,
          columnWrapperStyle,
          numColumns,
          this.props.extraData
        )}
      />
    )
  }
}

const styles = {
  row: { flexDirection: 'row' },
}

export default FlatList
