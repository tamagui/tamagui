// @ts-nocheck
import {
  invariant,
  StyleSheet,
  type LayoutEvent,
} from '@tamagui/react-native-web-internals'
import type { ViewProps } from '../../../View'
import type { CellRendererProps, RenderItemType } from './VirtualizedListProps'
import React from 'react'
import { VirtualizedListCellContextProvider } from './VirtualizedListContext'
import View from '../../../View'

type ViewStyleProp = ViewProps['style']

export type Props<ItemT> = {
  CellRendererComponent?: React.ComponentType<CellRendererProps<ItemT>> | null
  ItemSeparatorComponent: React.ComponentType<
    any | { highlighted: boolean; leadingItem: ItemT | null }
  > | null
  ListItemComponent?: React.ComponentType<any> | React.ReactElement | null
  cellKey: string
  horizontal?: boolean | null
  index: number
  inversionStyle: ViewStyleProp
  item: ItemT
  onCellLayout?: (event: LayoutEvent, cellKey: string, index: number) => void
  onCellFocusCapture?: (event: FocusEvent) => void
  onUnmount: (cellKey: string) => void
  onUpdateSeparators: (
    cellKeys: Array<string | null>,
    props: Partial<SeparatorProps<ItemT>>
  ) => void
  prevCellKey?: string | null
  renderItem?: RenderItemType<ItemT> | null
}

type SeparatorProps<ItemT> = Readonly<{
  highlighted: boolean
  leadingItem: ItemT | null
}>

type State<ItemT> = {
  separatorProps: SeparatorProps<ItemT>
}

export default class CellRenderer<ItemT> extends React.Component<
  Props<ItemT>,
  State<ItemT>
> {
  state: State<ItemT> = {
    separatorProps: {
      highlighted: false,
      leadingItem: this.props.item,
    },
  }

  static getDerivedStateFromProps(
    props: Props<ItemT>,
    prevState: State<ItemT>
  ): State<ItemT> | null {
    return {
      separatorProps: {
        ...prevState.separatorProps,
        leadingItem: props.item,
      },
    }
  }

  private _separators = {
    highlight: () => {
      const { cellKey, prevCellKey } = this.props
      this.props.onUpdateSeparators([cellKey, prevCellKey || null], {
        highlighted: true,
      })
    },
    unhighlight: () => {
      const { cellKey, prevCellKey } = this.props
      this.props.onUpdateSeparators([cellKey, prevCellKey || null], {
        highlighted: false,
      })
    },
    updateProps: (select: 'leading' | 'trailing', newProps: SeparatorProps<ItemT>) => {
      const { cellKey, prevCellKey } = this.props
      this.props.onUpdateSeparators(
        [select === 'leading' ? prevCellKey || null : cellKey],
        newProps
      )
    },
  }

  updateSeparatorProps(newProps: SeparatorProps<ItemT>) {
    this.setState((state) => ({
      separatorProps: { ...state.separatorProps, ...newProps },
    }))
  }

  componentWillUnmount() {
    this.props.onUnmount(this.props.cellKey)
  }

  private _onLayout = (nativeEvent: LayoutEvent): void => {
    this.props.onCellLayout &&
      this.props.onCellLayout(nativeEvent, this.props.cellKey, this.props.index)
  }

  private _renderElement(
    renderItem: RenderItemType<ItemT> | null | undefined,
    ListItemComponent: any,
    item: ItemT,
    index: number
  ): React.ReactNode {
    if (renderItem && ListItemComponent) {
      console.warn(
        'VirtualizedList: Both ListItemComponent and renderItem props are present. ListItemComponent will take precedence over renderItem.'
      )
    }

    if (ListItemComponent) {
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

  render(): React.ReactNode {
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

    const itemSeparator: React.ReactNode = React.isValidElement(ItemSeparatorComponent)
      ? ItemSeparatorComponent
      : ItemSeparatorComponent && (
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
        // @ts-ignore
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
