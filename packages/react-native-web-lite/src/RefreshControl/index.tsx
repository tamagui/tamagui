/**
 * Copyright (c) Nicolas Gallagher.
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import { ReactNode } from 'react'

import type { ColorValue } from '../types.js'
import type { ViewProps } from '../View/index.js'
import View from '../View/index.js'

type RefreshControlProps = {
  colors?: Array<ColorValue>
  enabled?: boolean
  onRefresh?: () => void
  progressBackgroundColor?: ColorValue
  progressViewOffset?: number
  refreshing: boolean
  size?: 0 | 1
  tintColor?: ColorValue
  title?: string
  titleColor?: ColorValue
} & ViewProps

function RefreshControl(props: RefreshControlProps): ReactNode {
  const {
    /* eslint-disable */
    colors,
    enabled,
    onRefresh,
    progressBackgroundColor,
    progressViewOffset,
    refreshing,
    size,
    tintColor,
    title,
    titleColor,
    /* eslint-enable */
    ...rest
  } = props

  return <View {...rest} />
}

export default RefreshControl
