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
      <_Path d="M176,216a8,8,0,0,1-8,8H24a8,8,0,0,1,0-16H168A8,8,0,0,1,176,216ZM247.1,89.5,228.5,66.7a35.9,35.9,0,0,0-46.2-8.2L139.5,83.6,81.3,64.2a4.1,4.1,0,0,0-2.9.1L61.9,71.4a12,12,0,0,0-3.3,19.9l26.6,24L63.7,127.5,37.6,116.3a4.4,4.4,0,0,0-3.2,0l-16.7,7.2a12,12,0,0,0-3.5,19.8h0l37.7,35.3a35.8,35.8,0,0,0,42.7,4.9L246,95.5a4,4,0,0,0,1.9-2.8A4.1,4.1,0,0,0,247.1,89.5Z" />
    </_Svg>
  )
}

Icon.displayName = 'AirplaneTakeoffFill'

export const AirplaneTakeoffFill = memo<IconProps>(themed(Icon))
