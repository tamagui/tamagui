/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { VirtualizedList } from '../VirtualizedList'
import * as React from 'react'

const defaultProps = {
  data: [],
  key: null,
  renderItem: null,
  ItemSeparatorComponent: null,
  keyExtractor: null,
}

class VirtualizedSectionList extends React.PureComponent {
  scrollToLocation(params) {
    let index = params.itemIndex
    for (let i = 0; i < params.sectionIndex; i++) {
      index += this.props.getItemCount(this.props.sections[i].data) + 2
    }
    let viewOffset = params.viewOffset || 0
    if (this._listRef == null) {
      return
    }
    if (params.itemIndex > 0 && this.props.stickySectionHeadersEnabled) {
      const frame = this._listRef.__getFrameMetricsApprox(
        index - params.itemIndex,
        this._listRef.props
      )
      viewOffset += frame.length
    }
    const toIndexParams = {
      ...params,
      viewOffset,
      index,
    }
    this._listRef.scrollToIndex(toIndexParams)
  }

  getListRef() {
    return this._listRef
  }

  render() {
    const {
      ItemSeparatorComponent,
      SectionSeparatorComponent,
      renderItem: _renderItem,
      renderSectionFooter,
      renderSectionHeader,
      sections: _sections,
      stickySectionHeadersEnabled,
      ...passThroughProps
    } = this.props

    const listHeaderOffset = this.props.ListHeaderComponent ? 1 : 0

    const stickyHeaderIndices = this.props.stickySectionHeadersEnabled ? [] : undefined

    let itemCount = 0
    for (const section of this.props.sections) {
      if (stickyHeaderIndices != null) {
        stickyHeaderIndices.push(itemCount + listHeaderOffset)
      }

      itemCount += 2
      itemCount += this.props.getItemCount(section.data)
    }
    const renderItem = this._renderItem(itemCount)

    return (
      <VirtualizedList
        {...passThroughProps}
        keyExtractor={this._keyExtractor}
        stickyHeaderIndices={stickyHeaderIndices}
        renderItem={renderItem}
        data={this.props.sections}
        getItem={(sections, index) => this._getItem(this.props, sections, index)}
        getItemCount={() => itemCount}
        onViewableItemsChanged={
          this.props.onViewableItemsChanged ? this._onViewableItemsChanged : undefined
        }
        ref={this._captureRef}
      />
    )
  }

  _getItem(props, sections, index) {
    if (!sections) {
      return null
    }
    let itemIdx = index - 1
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      const sectionData = section.data
      const itemCount = props.getItemCount(sectionData)
      if (itemIdx === -1 || itemIdx === itemCount) {
        return section
      } else if (itemIdx < itemCount) {
        return props.getItem(sectionData, itemIdx)
      } else {
        itemIdx -= itemCount + 2
      }
    }
    return null
  }

  _keyExtractor = (item, index) => {
    const keyExtractor = this.props.keyExtractor || this._defaultKeyExtractor
    return keyExtractor(item, index)
  }

  _defaultKeyExtractor = (item, index) => {
    return item.key != null ? item.key : String(index)
  }

  _captureRef = (ref) => {
    this._listRef = ref
  }

  _renderItem = (itemCount) => {
    return ({ item, index }) => {
      if (index === 0 || index === itemCount - 1) {
        return null
      }
      const renderItem = this.props.renderItem || this._defaultRenderItem
      return renderItem({ item, index, section: item })
    }
  }

  _defaultRenderItem = ({ item }) => {
    return null
  }

  _onViewableItemsChanged = (info) => {
    if (this.props.onViewableItemsChanged) {
      this.props.onViewableItemsChanged(info)
    }
  }
}

VirtualizedSectionList.defaultProps = defaultProps

export { VirtualizedSectionList }
export default VirtualizedSectionList
