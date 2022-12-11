/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *       strict-local
 */

'use strict'

import AnimatedImplementation from './AnimatedImplementation'

export default {
  ...AnimatedImplementation,
  /* $FlowFixMe[incompatible-call] createAnimatedComponent expects to receive
   * types. Plain intrinsic components can't be typed like this */
  div: AnimatedImplementation.createAnimatedComponent('div'),
  /* $FlowFixMe[incompatible-call] createAnimatedComponent expects to receive
   * types. Plain intrinsic components can't be typed like this */
  span: AnimatedImplementation.createAnimatedComponent('span'),
  /* $FlowFixMe[incompatible-call] createAnimatedComponent expects to receive
   * types. Plain intrinsic components can't be typed like this */
  img: AnimatedImplementation.createAnimatedComponent('img'),
}
