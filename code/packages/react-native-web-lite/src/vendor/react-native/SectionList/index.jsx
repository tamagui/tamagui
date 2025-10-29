/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { VirtualizedSectionList } from '../VirtualizedSectionList'
import * as React from 'react'

class SectionList extends React.PureComponent {
  scrollToLocation(params) {
    if (this._wrapperListRef != null) {
      this._wrapperListRef.scrollToLocation(params)
    }
  }

  recordInteraction() {
    const listRef = this._wrapperListRef && this._wrapperListRef.getListRef()
    listRef && listRef.recordInteraction()
  }

  flashScrollIndicators() {
    const listRef = this._wrapperListRef && this._wrapperListRef.getListRef()
    listRef && listRef.flashScrollIndicators()
  }

  getScrollResponder() {
    const listRef = this._wrapperListRef && this._wrapperListRef.getListRef()
    if (listRef) {
      return listRef.getScrollResponder()
    }
  }

  getScrollableNode() {
    const listRef = this._wrapperListRef && this._wrapperListRef.getListRef()
    if (listRef) {
      return listRef.getScrollableNode()
    }
  }

  setNativeProps(props) {
    const listRef = this._wrapperListRef && this._wrapperListRef.getListRef()
    if (listRef) {
      listRef.setNativeProps(props)
    }
  }

  render() {
    const { sections, ...passThroughProps } = this.props
    return (
      <VirtualizedSectionList
        {...passThroughProps}
        sections={sections}
        ref={this._captureRef}
        getItem={this._getItem}
        getItemCount={this._getItemCount}
        keyExtractor={this._keyExtractor}
        renderItem={this._renderItem}
      />
    )
  }

  _captureRef = (ref) => {
    this._wrapperListRef = ref
  }

  _getItem = (sections, index) => {
    if (!sections) {
      return null
    }
    const section = sections[index]
    return section && section.data ? section.data[0] : null
  }

  _getItemCount = (sections) => {
    return sections ? sections.length : 0
  }

  _keyExtractor = (item, index) => {
    const keyExtractor = this.props.keyExtractor || this._defaultKeyExtractor
    return keyExtractor(item, index)
  }

  _defaultKeyExtractor = (item, index) => {
    return item.key != null ? item.key : String(index)
  }

  _renderItem = ({ item, index, section }) => {
    const renderItem = this.props.renderItem || this._defaultRenderItem
    return renderItem({ item, index, section })
  }

  _defaultRenderItem = ({ item }) => {
    return null
  }
}

export { SectionList }
export default SectionList;
