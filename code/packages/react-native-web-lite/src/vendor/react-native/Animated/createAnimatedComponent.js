import * as React from 'react'
import { useMergeRefs } from '@tamagui/react-native-web-internals'

/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @format
 */
import useAnimatedProps from './useAnimatedProps'

/**
 * Experimental implementation of `createAnimatedComponent` that is intended to
 * be compatible with concurrent rendering.
 */
export default function createAnimatedComponent(Component) {
  return /*#__PURE__*/ React.forwardRef((props, forwardedRef) => {
    var _useAnimatedProps = useAnimatedProps(props),
      reducedProps = _useAnimatedProps[0],
      callbackRef = _useAnimatedProps[1]

    var ref = useMergeRefs(callbackRef, forwardedRef) // Some components require explicit passthrough values for animation
    // to work properly. For example, if an animated component is
    // transformed and Pressable, onPress will not work after transform
    // without these passthrough values.
    // $FlowFixMe[prop-missing]

    var passthroughAnimatedPropExplicitValues =
        reducedProps.passthroughAnimatedPropExplicitValues,
      style = reducedProps.style

    var _ref =
      passthroughAnimatedPropExplicitValues !== null &&
      passthroughAnimatedPropExplicitValues !== void 0
        ? passthroughAnimatedPropExplicitValues
        : {}

    const { passthroughStyle, ...passthroughProps } = _ref

    var mergedStyle = [style, passthroughStyle]
    return /*#__PURE__*/ React.createElement(Component, {
      ...reducedProps,
      ...passthroughProps,
      style: mergedStyle,
      ref: ref,
    })
  })
}
