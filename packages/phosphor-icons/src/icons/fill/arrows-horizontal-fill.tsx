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
      <_Path d="M237.7,133.7l-32,32A8.3,8.3,0,0,1,200,168a8.5,8.5,0,0,1-3.1-.6A8,8,0,0,1,192,160V136H64v24a8,8,0,0,1-4.9,7.4,8.5,8.5,0,0,1-3.1.6,8.3,8.3,0,0,1-5.7-2.3l-32-32a8.1,8.1,0,0,1,0-11.4l32-32a8.4,8.4,0,0,1,8.8-1.7A8,8,0,0,1,64,96v24H192V96a8,8,0,0,1,4.9-7.4,8.4,8.4,0,0,1,8.8,1.7l32,32A8.1,8.1,0,0,1,237.7,133.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowsHorizontalFill'

export const ArrowsHorizontalFill = memo<IconProps>(themed(Icon))
