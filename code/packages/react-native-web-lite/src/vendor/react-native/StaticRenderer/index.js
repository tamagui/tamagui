/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 * @format
 */

'use strict';

import * as React from 'react';


class StaticRenderer extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.shouldUpdate;
  }

  render() {
    return this.props.render();
  }
}

export { StaticRenderer }
export default StaticRenderer;
