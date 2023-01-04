import PropTypes from 'prop-types'
import React, { memo } from 'react'
import {
  Circle as _Circle,
  Defs as _Defs,
  Ellipse as _Ellipse,
  G as _G,
  Line as _Line,
  LinearGradient as _LinearGradient,
  Path as _Path,
  Polygon as _Polygon,
  Polyline as _Polyline,
  RadialGradient as _RadialGradient,
  Rect as _Rect,
  Stop as _Stop,
  Svg as _Svg,
  Symbol as _Symbol,
  Text as _Text,
  Use as _Use,
} from 'react-native-svg'

import { IconProps } from '../../IconProps'
import { themed } from '../../themed'

const Icon = (props) => {
  const { color = 'black', size = 24, ...otherProps } = props
  return (
    <_Svg
      viewBox="0 0 256 256"
      {...otherProps}
      height={size}
      width={size}
      fill={`${color}`}
    >
      <_Rect width="256" height="256" fill="none" />
      <_Path d="M248,88a8,8,0,0,0-8,8v64a8,8,0,0,0,16,0V96A8,8,0,0,0,248,88Z" />
      <_Path d="M200,48H48A24.1,24.1,0,0,0,24,72V184a24.1,24.1,0,0,0,24,24H200a24.1,24.1,0,0,0,24-24V72A24.1,24.1,0,0,0,200,48Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V72a8,8,0,0,1,8-8H200a8,8,0,0,1,8,8Z" />
      <_Rect x="56" y="80" width="32" height="96" rx="8" />
    </_Svg>
  )
}

Icon.displayName = 'BatteryLowFill'

export const BatteryLowFill = memo<IconProps>(themed(Icon))
