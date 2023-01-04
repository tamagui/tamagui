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
      <_Path d="M79.8,107.7h-48a8,8,0,0,1-8-8v-48a8.2,8.2,0,0,1,5-7.4,8,8,0,0,1,8.7,1.8L55.8,64.4l4.3-4.3a96.2,96.2,0,0,1,135.8,0,8,8,0,0,1,0,11.3,7.9,7.9,0,0,1-11.3,0,80.2,80.2,0,0,0-113.2,0l-4.3,4.3L85.5,94.1a8,8,0,0,1-5.7,13.6Zm144.4,40.6h-48a8,8,0,0,0-5.7,13.6l18.4,18.4-4.3,4.3a80.2,80.2,0,0,1-113.2,0,7.9,7.9,0,0,0-11.3,0,8,8,0,0,0,0,11.3,96.1,96.1,0,0,0,135.8,0l4.3-4.3,18.3,18.3a7.8,7.8,0,0,0,5.7,2.4,8,8,0,0,0,3-.6,8.2,8.2,0,0,0,5-7.4v-48A8,8,0,0,0,224.2,148.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowsCounterClockwiseFill'

export const ArrowsCounterClockwiseFill = memo<IconProps>(themed(Icon))
