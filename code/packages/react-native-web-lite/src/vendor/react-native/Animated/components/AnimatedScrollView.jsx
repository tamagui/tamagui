/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */

import * as React from 'react';

import { ScrollView as ScrollViewComponent } from '../../../../ScrollView';
import { createAnimatedComponent } from '../createAnimatedComponent';


/**
 * @see https://github.com/facebook/react-native/commit/b8c8562
 */
const ScrollViewWithEventThrottle = React.forwardRef((props, ref) => (
  <ScrollViewComponent scrollEventThrottle={0.0001} {...props} ref={ref} />
));

const ScrollView = createAnimatedComponent(ScrollViewWithEventThrottle);
export { ScrollView }
export default ScrollView;
