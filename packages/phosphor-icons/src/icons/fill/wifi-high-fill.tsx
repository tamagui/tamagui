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
      <_Path d="M246.9,80.5a15.6,15.6,0,0,0-6.2-10.9c-66.4-50.1-159-50.1-225.3-.1a16.1,16.1,0,0,0-6.2,11,16.6,16.6,0,0,0,3.7,12.3l103,121.3a15.9,15.9,0,0,0,24.2,0l103-121.4A16.4,16.4,0,0,0,246.9,80.5Z" />
    </_Svg>
  )
}

Icon.displayName = 'WifiHighFill'

export const WifiHighFill = memo<IconProps>(themed(Icon))
