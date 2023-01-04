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
      <_Path d="M239.6,126.6A112.1,112.1,0,0,0,128,24h0A112.1,112.1,0,0,0,16.4,126.6a15.7,15.7,0,0,0,4.2,12.2A15.9,15.9,0,0,0,32.3,144H120v56a32,32,0,0,0,64,0,8,8,0,0,0-16,0,16,16,0,0,1-32,0V144h87.7a15.9,15.9,0,0,0,11.7-5.2A15.7,15.7,0,0,0,239.6,126.6ZM32.3,128a95.9,95.9,0,0,1,75.9-85.9c-11.7,16-26.4,44-28,85.9Zm143.5,0c-1.6-41.9-16.3-69.9-28-85.9A95.9,95.9,0,0,1,223.7,128Z" />
    </_Svg>
  )
}

Icon.displayName = 'UmbrellaFill'

export const UmbrellaFill = memo<IconProps>(themed(Icon))
