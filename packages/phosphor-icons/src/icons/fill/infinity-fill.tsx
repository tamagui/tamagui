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
      <_Path d="M248,128a56,56,0,0,1-95.6,39.6l-.3-.4-60-67.6A39.5,39.5,0,0,0,64,88a40,40,0,1,0,0,80,39.5,39.5,0,0,0,28.1-11.6l8.5-9.6a8,8,0,0,1,12,10.6l-8.7,9.8-.3.4a56,56,0,0,1-79.2,0A56,56,0,0,1,64,72a55.5,55.5,0,0,1,39.6,16.4l.3.4,60,67.6A39.5,39.5,0,0,0,192,168a40,40,0,1,0,0-80,39.5,39.5,0,0,0-28.1,11.6l-8.5,9.6a8,8,0,0,1-12-10.6l8.7-9.8.3-.4A56,56,0,0,1,248,128Z" />
    </_Svg>
  )
}

Icon.displayName = 'InfinityFill'

export const InfinityFill = memo<IconProps>(themed(Icon))
