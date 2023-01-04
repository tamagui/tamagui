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
      <_Path d="M136,40V216a8,8,0,0,1-16,0V40a8,8,0,0,1,16,0ZM69.7,90.3a8.4,8.4,0,0,0-8.8-1.7A8,8,0,0,0,56,96v24H16a8,8,0,0,0,0,16H56v24a8,8,0,0,0,4.9,7.4,8.5,8.5,0,0,0,3.1.6,8.3,8.3,0,0,0,5.7-2.3l32-32a8.1,8.1,0,0,0,0-11.4ZM240,120H200V96a8,8,0,0,0-4.9-7.4,8.4,8.4,0,0,0-8.8,1.7l-32,32a8.1,8.1,0,0,0,0,11.4l32,32A8.3,8.3,0,0,0,192,168a8.5,8.5,0,0,0,3.1-.6A8,8,0,0,0,200,160V136h40a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowsInLineHorizontalFill'

export const ArrowsInLineHorizontalFill = memo<IconProps>(themed(Icon))
