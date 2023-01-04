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
      <_Path d="M56,32a8,8,0,0,1,8,8v73.7L183.7,40.6A16,16,0,0,1,208,54.3V201.7a15.9,15.9,0,0,1-8.2,14,15.4,15.4,0,0,1-7.8,2,16.2,16.2,0,0,1-8.3-2.3L64,142.3V216a8,8,0,0,1-16,0V40A8,8,0,0,1,56,32Z" />
    </_Svg>
  )
}

Icon.displayName = 'SkipBackFill'

export const SkipBackFill = memo<IconProps>(themed(Icon))
