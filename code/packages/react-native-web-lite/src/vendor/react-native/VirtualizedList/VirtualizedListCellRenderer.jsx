/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */


import { View } from '../../../View'
import { StyleSheet, invariant } from '@tamagui/react-native-web-internals'
import { VirtualizedListCellContextProvider } from './VirtualizedListContext'
import * as React from 'react'

class CellRenderer extends React.Component {
  state = {
    separatorProps: {
      highlighted: false,
      leadingItem: this.props.item,
    },
  }

  static getDerivedStateFromProps(props, prevState) {
    return {
      separatorProps: {
        ...prevState.separatorProps,
        leadingItem: props.item,
      },
    }
  }

  // TODO: consider factoring separator stuff out of VirtualizedList into FlatList since it's not
  // reused by SectionList and we can keep VirtualizedList simpler.
  // $FlowFixMe[missing-local-annot]
  _separators = {
    highlight: () => {
      const { cellKey, prevCellKey } = this.props
      this.props.onUpdateSeparators?.([cellKey, prevCellKey], {
        highlighted: true,
      })
    },
    unhighlight: () => {
      const { cellKey, prevCellKey } = this.props
      this.props.onUpdateSeparators?.([cellKey, prevCellKey], {
        highlighted: false,
      })
    },
    updateProps: (select, newProps) => {
      const { cellKey, prevCellKey } = this.props
      this.props.onUpdateSeparators?.(
        [select === 'leading' ? prevCellKey : cellKey],
        newProps
      )
    },
  }

  updateSeparatorProps(newProps) {
    this.setState((state) => ({
      separatorProps: { ...state.separatorProps, ...newProps },
    }))
  }

  componentWillUnmount() {
    this.props.onUnmount?.(this.props.cellKey)
  }

  _onLayout = (nativeEvent) => {
    this.props.onCellLayout?.(nativeEvent, this.props.cellKey, this.props.index)
  }

  _renderElement(renderItem, ListItemComponent, item, index) {
    if (renderItem && ListItemComponent) {
      console.warn(
        'VirtualizedList: Both ListItemComponent and renderItem props are present. ListItemComponent will take' +
          ' precedence over renderItem.'
      )
    }

    if (ListItemComponent) {
      /* $FlowFixMe[not-a-component] (>=0.108.0 site=react_native_fb) This
       * comment suppresses an error found when Flow v0.108 was deployed. To
       * see the error, delete this comment and run Flow. */
      /* $FlowFixMe[incompatible-type-arg] (>=0.108.0 site=react_native_fb)
       * This comment suppresses an error found when Flow v0.108 was deployed.
       * To see the error, delete this comment and run Flow. */
      return React.createElement(ListItemComponent, {
        item,
        index,
        separators: this._separators,
      })
    }

    if (renderItem) {
      return renderItem({
        item,
        index,
        separators: this._separators,
      })
    }

    invariant(
      false,
      'VirtualizedList: Either ListItemComponent or renderItem props are required but none were found.'
    )
  }

  render() {
    const {
      CellRendererComponent,
      ItemSeparatorComponent,
      ListItemComponent,
      cellKey,
      horizontal,
      item,
      index,
      inversionStyle,
      onCellFocusCapture,
      onCellLayout,
      renderItem,
    } = this.props
    const element = this._renderElement(renderItem, ListItemComponent, item, index)

    // NOTE: that when this is a sticky header, `onLayout` will get automatically extracted and
    // called explicitly by `ScrollViewStickyHeader`.
    const itemSeparator = React.isValidElement(ItemSeparatorComponent)
      ? // $FlowFixMe[incompatible-type]
        ItemSeparatorComponent
      : // $FlowFixMe[incompatible-type]
        ItemSeparatorComponent && (
          <ItemSeparatorComponent {...this.state.separatorProps} />
        )
    const cellStyle = inversionStyle
      ? horizontal
        ? [styles.rowReverse, inversionStyle]
        : [styles.columnReverse, inversionStyle]
      : horizontal
        ? [styles.row, inversionStyle]
        : inversionStyle
    const result = !CellRendererComponent ? (
      <View
        style={cellStyle}
        onFocusCapture={onCellFocusCapture}
        {...(onCellLayout && { onLayout: this._onLayout })}
      >
        {element}
        {itemSeparator}
      </View>
    ) : (
      <CellRendererComponent
        cellKey={cellKey}
        index={index}
        item={item}
        style={cellStyle}
        onFocusCapture={onCellFocusCapture}
        {...(onCellLayout && { onLayout: this._onLayout })}
      >
        {element}
        {itemSeparator}
      </CellRendererComponent>
    )

    return (
      <VirtualizedListCellContextProvider cellKey={this.props.cellKey}>
        {result}
      </VirtualizedListCellContextProvider>
    )
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  columnReverse: {
    flexDirection: 'column-reverse',
  },
})

export default CellRenderer
export { CellRenderer }
