/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */

import { View } from '../../../View';
import { deepDiffer } from '../deepDiffer';
import { Platform } from '../../../exports/Platform';
import { invariant, StyleSheet } from '@tamagui/react-native-web-internals';
import * as React from 'react';

import { VirtualizedList } from '../VirtualizedList';
import { keyExtractor as defaultKeyExtractor } from '../VirtualizeUtils';

import memoizeOne from 'memoize-one';


// Props interface removed - Flow types converted
  /**
   * Takes an item from `data` and renders it into the list. Example usage:
   *
   *     <FlatList
   *       ItemSeparatorComponent={Platform.OS !== 'android' && ({highlighted}) => (
   *         
   *       )}
   *       data={[{title: 'Title Text', key: 'item1'}]}
   *       renderItem={({item, separators}) => (
   *         <TouchableHighlight
   *           onPress={() => this._onPress(item)}
   *           onShowUnderlay={separators.highlight}
   *           onHideUnderlay={separators.unhighlight}>
   *           
   *             <Text>{item.title}</Text>
   *           </View>
   *         </TouchableHighlight>
   *       )}
   *     />
   *
   * Provides additional metadata like `index` if you need it, as well as a more generic
   * `separators.updateProps` function which let's you set whatever props you want to change the
   * rendering of either the leading separator or trailing separator in case the more common
   * `highlight` and `unhighlight` (which set the `highlighted: boolean` prop) are insufficient for
   * your use-case.
   */
// Props interface removed - Flow types converted

/**
 * Default Props Helper Functions
 * Use the following helper functions for default values
 */

// removeClippedSubviewsOrDefault(this.props.removeClippedSubviews)
function removeClippedSubviewsOrDefault(removeClippedSubviews) {
  return removeClippedSubviews ?? Platform.OS === 'android';
}

// numColumnsOrDefault(this.props.numColumns)
function numColumnsOrDefault(numColumns) {
  return numColumns ?? 1;
}

function isArrayLike(data) {
  return typeof Object(data).length === 'number';
}

// Complex type definitions removed - Flow types converted

/**
 * A performant interface for rendering simple, flat lists, supporting the most handy features:
 *
 *  - Fully cross-platform.
 *  - Optional horizontal mode.
 *  - Configurable viewability callbacks.
 *  - Header support.
 *  - Footer support.
 *  - Separator support.
 *  - Pull to Refresh.
 *  - Scroll loading.
 *  - ScrollToIndex support.
 *
 * If you need section support, use [`<SectionList>`](docs/sectionlist.html).
 *
 * Minimal Example:
 *
 *     <FlatList
 *       data={[{key: 'a'}, {key: 'b'}]}
 *       renderItem={({item}) => <Text>{item.key}</Text>}
 *     />
 *
 * More complex, multi-select example demonstrating `PureComponent` usage for perf optimization and avoiding bugs.
 *
 * - By binding the `onPressItem` handler, the props will remain `===` and `PureComponent` will
 *   prevent wasteful re-renders unless the actual `id`, `selected`, or `title` props change, even
 *   if the components rendered in `MyListItem` did not have such optimizations.
 * - By passing `extraData={this.state}` to `FlatList` we make sure `FlatList` itself will re-render
 *   when the `state.selected` changes. Without setting this prop, `FlatList` would not know it
 *   needs to re-render any items because it is also a `PureComponent` and the prop comparison will
 *   not show any changes.
 * - `keyExtractor` tells the list to use the `id`s for the react keys instead of the default `key` property.
 *
 *
 *     class MyListItem extends React.PureComponent {
 *       _onPress = () => {
 *         this.props.onPressItem(this.props.id);
 *       };
 *
 *       render() {
 *         const textColor = this.props.selected ? "red" : "black";
 *         return (
 *           <TouchableOpacity onPress={this._onPress}>
 *             <View>
 *               
 *                 {this.props.title}
 *               </Text>
 *             </View>
 *           </TouchableOpacity>
 *         );
 *       }
 *     }
 *
 *     class MultiSelectList extends React.PureComponent {
 *       state = {selected: new Map()};
 *
 *       _keyExtractor = (item, index) => item.id;
 *
 *       _onPressItem = (id) => {
 *         // updater functions are preferred for transactional updates
 *         this.setState((state) => {
 *           // copy the map rather than modifying state.
 *           const selected = new Map(state.selected);
 *           selected.set(id, !selected.get(id)); // toggle
 *           return {selected};
 *         });
 *       };
 *
 *       _renderItem = ({item}) => (
 *         <MyListItem
 *           id={item.id}
 *           onPressItem={this._onPressItem}
 *           selected={!!this.state.selected.get(item.id)}
 *           title={item.title}
 *         />
 *       );
 *
 *       render() {
 *         return (
 *           <FlatList
 *             data={this.props.data}
 *             extraData={this.state}
 *             keyExtractor={this._keyExtractor}
 *             renderItem={this._renderItem}
 *           />
 *         );
 *       }
 *     }
 *
 * This is a convenience wrapper around [`<VirtualizedList>`](docs/virtualizedlist.html),
 * and thus inherits its props (as well as those of `ScrollView`) that aren't explicitly listed
 * here, along with the following caveats:
 *
 * - Internal state is not preserved when content scrolls out of the render window. Make sure all
 *   your data is captured in the item data or external stores like Flux, Redux, or Relay.
 * - This is a `PureComponent` which means that it will not re-render if `props` remain shallow-
 *   equal. Make sure that everything your `renderItem` function depends on is passed as a prop
 *   (e.g. `extraData`) that is not `===` after updates, otherwise your UI may not update on
 *   changes. This includes the `data` prop and parent component state.
 * - In order to constrain memory and enable smooth scrolling, content is rendered asynchronously
 *   offscreen. This means it's possible to scroll faster than the fill rate ands momentarily see
 *   blank content. This is a tradeoff that can be adjusted to suit the needs of each application,
 *   and we are working on improving it behind the scenes.
 * - By default, the list looks for a `key` prop on each item and uses that for the React key.
 *   Alternatively, you can provide a custom `keyExtractor` prop.
 *
 * Also inherits [ScrollView Props](docs/scrollview.html#props), unless it is nested in another FlatList of same orientation.
 */
class FlatList extends React.PureComponent {
  /**
   * Scrolls to the end of the content. May be janky without `getItemLayout` prop.
   */
  scrollToEnd(params) {
    if (this._listRef) {
      this._listRef.scrollToEnd(params);
    }
  }

  /**
   * Scrolls to the item at the specified index such that it is positioned in the viewable area
   * such that `viewPosition` 0 places it at the top, 1 at the bottom, and 0.5 centered in the
   * middle. `viewOffset` is a fixed number of pixels to offset the final target position.
   *
   * Note: cannot scroll to locations outside the render window without specifying the
   * `getItemLayout` prop.
   */
  scrollToIndex(params) {
    if (this._listRef) {
      this._listRef.scrollToIndex(params);
    }
  }

  /**
   * Requires linear scan through data - use `scrollToIndex` instead if possible.
   *
   * Note: cannot scroll to locations outside the render window without specifying the
   * `getItemLayout` prop.
   */
  scrollToItem(params) {
    if (this._listRef) {
      this._listRef.scrollToItem(params);
    }
  }

  /**
   * Scroll to a specific content pixel offset in the list.
   *
   * Check out [scrollToOffset](docs/virtualizedlist.html#scrolltooffset) of VirtualizedList
   */
  scrollToOffset(params) {
    if (this._listRef) {
      this._listRef.scrollToOffset(params);
    }
  }

  /**
   * Tells the list an interaction has occurred, which should trigger viewability calculations, e.g.
   * if `waitForInteractions` is true and the user has not scrolled. This is typically called by
   * taps on items or by navigation actions.
   */
  recordInteraction() {
    if (this._listRef) {
      this._listRef.recordInteraction();
    }
  }

  /**
   * Displays the scroll indicators momentarily.
   *
   * @platform ios
   */
  flashScrollIndicators() {
    if (this._listRef) {
      this._listRef.flashScrollIndicators();
    }
  }

  /**
   * Provides a handle to the underlying scroll responder.
   */
  getScrollResponder() {
    if (this._listRef) {
      return this._listRef.getScrollResponder();
    }
  }

  /**
   * Provides a reference to the underlying host component
   */
  getNativeScrollRef() {
    if (this._listRef) {
      return this._listRef.getScrollRef();
    }
  }

  getScrollableNode() {
    if (this._listRef) {
      return this._listRef.getScrollableNode();
    }
  }

  constructor(props) {
    super(props);
    this._checkProps(this.props);
    if (this.props.viewabilityConfigCallbackPairs) {
      this._virtualizedListPairs =
        this.props.viewabilityConfigCallbackPairs.map(pair => ({
          viewabilityConfig: pair.viewabilityConfig,
          onViewableItemsChanged: this._createOnViewableItemsChanged(
            pair.onViewableItemsChanged,
          ),
        }));
    } else if (this.props.onViewableItemsChanged) {
      this._virtualizedListPairs.push({
        viewabilityConfig: this.props.viewabilityConfig,
        onViewableItemsChanged: this._createOnViewableItemsChanged(
          this.props.onViewableItemsChanged,
        ),
      });
    }
  }

  componentDidUpdate(prevProps) {
    invariant(
      prevProps.numColumns === this.props.numColumns,
      'Changing numColumns on the fly is not supported. Change the key prop on FlatList when ' +
        'changing the number of columns to force a fresh render of the component.',
    );
    invariant(
      prevProps.onViewableItemsChanged === this.props.onViewableItemsChanged,
      'Changing onViewableItemsChanged on the fly is not supported',
    );
    invariant(
      !deepDiffer(prevProps.viewabilityConfig, this.props.viewabilityConfig),
      'Changing viewabilityConfig on the fly is not supported',
    );
    invariant(
      prevProps.viewabilityConfigCallbackPairs ===
        this.props.viewabilityConfigCallbackPairs,
      'Changing viewabilityConfigCallbackPairs on the fly is not supported',
    );

    this._checkProps(this.props);
  }

  _listRef;
  _virtualizedListPairs = [];

  _captureRef = (ref) => {
    this._listRef = ref;
  };

  _checkProps(props) {
    const {
      getItem,
      getItemCount,
      horizontal,
      columnWrapperStyle,
      onViewableItemsChanged,
      viewabilityConfigCallbackPairs,
    } = props;
    const numColumns = numColumnsOrDefault(this.props.numColumns);
    invariant(
      !getItem && !getItemCount,
      'FlatList does not support custom data formats.',
    );
    if (numColumns > 1) {
      invariant(!horizontal, 'numColumns does not support horizontal.');
    } else {
      invariant(
        !columnWrapperStyle,
        'columnWrapperStyle not supported for single column lists',
      );
    }
    invariant(
      !(onViewableItemsChanged && viewabilityConfigCallbackPairs),
      'FlatList does not support setting both onViewableItemsChanged and ' +
        'viewabilityConfigCallbackPairs.',
    );
  }

  _getItem = (data, index) => {
    const numColumns = numColumnsOrDefault(this.props.numColumns);
    if (numColumns > 1) {
      const ret = [];
      for (let kk = 0; kk < numColumns; kk++) {
        const itemIndex = index * numColumns + kk;
        if (itemIndex < data.length) {
          const item = data[itemIndex];
          ret.push(item);
        }
      }
      return ret;
    } else {
      return data[index];
    }
  };

  _getItemCount = (data) => {
    // Legacy behavior of FlatList was to forward "undefined" length if invalid
    // data like a non-arraylike object is passed. VirtualizedList would then
    // coerce this, and the math would work out to no-op. For compatibility, if
    // invalid data is passed, we tell VirtualizedList there are zero items
    // available to prevent it from trying to read from the invalid data
    // (without propagating invalidly typed data).
    if (data != null && isArrayLike(data)) {
      const numColumns = numColumnsOrDefault(this.props.numColumns);
      return numColumns > 1 ? Math.ceil(data.length / numColumns) : data.length;
    } else {
      return 0;
    }
  };

  _keyExtractor = (items, index) => {
    const numColumns = numColumnsOrDefault(this.props.numColumns);
    const keyExtractor = this.props.keyExtractor ?? defaultKeyExtractor;

    if (numColumns > 1) {
      invariant(
        Array.isArray(items),
        'FlatList: Encountered internal consistency error, expected each item to consist of an ' +
          'array with 1-%s columns; instead, received a single item.',
        numColumns,
      );
      return items
        .map((item, kk) =>
          keyExtractor(item, index * numColumns + kk),
        )
        .join(':');
    }

    return keyExtractor(items, index);
  };

  _pushMultiColumnViewable(arr, v) {
    const numColumns = numColumnsOrDefault(this.props.numColumns);
    const keyExtractor = this.props.keyExtractor ?? defaultKeyExtractor;
    v.item.forEach((item, ii) => {
      invariant(v.index != null, 'Missing index!');
      const index = v.index * numColumns + ii;
      arr.push({...v, item, key: keyExtractor(item, index), index});
    });
  }

  _createOnViewableItemsChanged(
    onViewableItemsChanged,
  ) {
    return (info) => {
      const numColumns = numColumnsOrDefault(this.props.numColumns);
      if (onViewableItemsChanged) {
        if (numColumns > 1) {
          const changed = [];
          const viewableItems = [];
          info.viewableItems.forEach(v =>
            this._pushMultiColumnViewable(viewableItems, v),
          );
          info.changed.forEach(v => this._pushMultiColumnViewable(changed, v));
          onViewableItemsChanged({viewableItems, changed});
        } else {
          onViewableItemsChanged(info);
        }
      }
    };
  }

  _renderer = (
    ListItemComponent,
    renderItem,
    columnWrapperStyle,
    numColumns,
    extraData,
  ) => {
    const cols = numColumnsOrDefault(numColumns);

    const render = (props) => {
      if (ListItemComponent) {
        return <ListItemComponent {...props} />;
      } else if (renderItem) {
        return renderItem(props);
      } else {
        return null;
      }
    };

    const renderProp = (info) => {
      if (cols > 1) {
        const {item, index} = info;
        invariant(
          Array.isArray(item),
          'Expected array of items with numColumns > 1',
        );
        return (
          <View style={[styles.row, columnWrapperStyle]}>
            {item.map((it, kk) => {
              const element = render({
                item: it,
                index: index * cols + kk,
                separators: info.separators,
              });
              return element != null ? (
                <React.Fragment key={kk}>{element}</React.Fragment>
              ) : null;
            })}
          </View>
        );
      } else {
        return render(info);
      }
    };

    return ListItemComponent
      ? {ListItemComponent: renderProp}
      : {renderItem: renderProp};
  };

  // $FlowFixMe[missing-local-annot]
  _memoizedRenderer = memoizeOne(this._renderer);

  render() {
    const {
      numColumns,
      columnWrapperStyle,
      removeClippedSubviews: _removeClippedSubviews,
      strictMode = false,
      ...restProps
    } = this.props;

    const renderer = strictMode ? this._memoizedRenderer : this._renderer;

    return (
      <VirtualizedList
        {...restProps}
        getItem={this._getItem}
        getItemCount={this._getItemCount}
        keyExtractor={this._keyExtractor}
        ref={this._captureRef}
        viewabilityConfigCallbackPairs={this._virtualizedListPairs}
        removeClippedSubviews={removeClippedSubviewsOrDefault(
          _removeClippedSubviews,
        )}
        {...renderer(
          this.props.ListItemComponent,
          this.props.renderItem,
          columnWrapperStyle,
          numColumns,
          this.props.extraData,
        )}
      />
    );
  }
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row'},
});

export { FlatList }
export default FlatList;
