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
      <_Path d="M246.8,80.5a15.7,15.7,0,0,0-6.2-11c-66.3-50-158.9-50-225.2,0h0a16.1,16.1,0,0,0-6.2,11,16.6,16.6,0,0,0,3.7,12.3L115.8,214a16.4,16.4,0,0,0,4,3.4,15.6,15.6,0,0,0,8.2,2.3h0a15.7,15.7,0,0,0,10.9-4.4,6.8,6.8,0,0,0,1.2-1.2l103-121.4A16,16,0,0,0,246.8,80.5Zm-15.9,1.9-47.1,55.5a95.9,95.9,0,0,0-111.6,0L25.1,82.4h0c60.6-45.7,145.3-45.7,205.8,0Z" />
    </_Svg>
  )
}

Icon.displayName = 'WifiLowFill'

export const WifiLowFill = memo<IconProps>(themed(Icon))
