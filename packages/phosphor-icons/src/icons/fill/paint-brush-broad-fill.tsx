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
      <_Path d="M216,24H72A40,40,0,0,0,32,64v72a24.1,24.1,0,0,0,24,24h46.8l-6.7,46.9A3.7,3.7,0,0,0,96,208a32,32,0,0,0,64,0,3.7,3.7,0,0,0-.1-1.1L153.2,160H200a24.1,24.1,0,0,0,24-24V32A8,8,0,0,0,216,24ZM72,40H176V80a8,8,0,0,0,16,0V40h16v64H48V64A24.1,24.1,0,0,1,72,40Z" />
    </_Svg>
  )
}

Icon.displayName = 'PaintBrushBroadFill'

export const PaintBrushBroadFill = memo<IconProps>(themed(Icon))
