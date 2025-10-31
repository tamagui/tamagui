/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import { useAnimatedProps } from './useAnimatedProps';
import { useMergeRefs } from '../Utilities/useMergeRefs';
import * as React from 'react';


/**
 * Experimental implementation of `createAnimatedComponent` that is intended to
 * be compatible with concurrent rendering.
 */
function createAnimatedComponent(
  Component,
) {
  return React.forwardRef((props, forwardedRef) => {
    const [reducedProps, callbackRef] = useAnimatedProps(
      props,
    );
    const ref = useMergeRefs(callbackRef, forwardedRef);

    // Some components require explicit passthrough values for animation
    // to work properly. For example, if an animated component is
    // transformed and Pressable, onPress will not work after transform
    // without these passthrough values.
    const {passthroughAnimatedPropExplicitValues, style} = reducedProps;
    const {style: passthroughStyle, ...passthroughProps} =
      passthroughAnimatedPropExplicitValues ?? {};
    const mergedStyle = [style, passthroughStyle];

    return (
      <Component
        {...reducedProps}
        {...passthroughProps}
        style={mergedStyle}
        ref={ref}
      />
    );
  });
}

export { createAnimatedComponent }
export default createAnimatedComponent;
