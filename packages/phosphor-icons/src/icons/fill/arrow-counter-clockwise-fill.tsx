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
      <_Path d="M195.9,195.9a96.1,96.1,0,0,1-135.8,0,8,8,0,0,1,0-11.3,7.9,7.9,0,0,1,11.3,0,80,80,0,1,0,0-113.2l-4.3,4.3L85.5,94.1a8,8,0,0,1-5.7,13.6h-48a8,8,0,0,1-8-8v-48a8.2,8.2,0,0,1,5-7.4,8,8,0,0,1,8.7,1.8L55.8,64.4l4.3-4.3A96,96,0,0,1,195.9,195.9Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowCounterClockwiseFill'

export const ArrowCounterClockwiseFill = memo<IconProps>(themed(Icon))
