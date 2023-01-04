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
      <_Path d="M256,96v64a8,8,0,0,1-16,0V96a8,8,0,0,1,16,0ZM224,72V184a24.1,24.1,0,0,1-24,24H48a24.1,24.1,0,0,1-24-24V72A24.1,24.1,0,0,1,48,48H200A24.1,24.1,0,0,1,224,72ZM116,128a8,8,0,0,0,16,0V88a8,8,0,0,0-16,0Zm20,36a12,12,0,1,0-12,12A12,12,0,0,0,136,164Z" />
    </_Svg>
  )
}

Icon.displayName = 'BatteryWarningFill'

export const BatteryWarningFill = memo<IconProps>(themed(Icon))
