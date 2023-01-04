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
      <_Path d="M160,143.3V48a40,40,0,0,0-80,0v95.3A59.4,59.4,0,0,0,60,188a60,60,0,0,0,120,0A59.4,59.4,0,0,0,160,143.3ZM120,24a24.1,24.1,0,0,1,24,24v8H96V48A24.1,24.1,0,0,1,120,24Zm58.1,61.7a8,8,0,0,1,0-11.4,28,28,0,0,1,19.8-8.2,28.4,28.4,0,0,1,19.8,8.2,11.9,11.9,0,0,0,16.9,0,8,8,0,0,1,11.3,11.4,28,28,0,0,1-19.8,8.2,28.4,28.4,0,0,1-19.8-8.2,11.9,11.9,0,0,0-16.9,0A8,8,0,0,1,178.1,85.7Zm67.8,28.6a8,8,0,0,1,0,11.4,28,28,0,0,1-19.8,8.2,28.4,28.4,0,0,1-19.8-8.2,11.9,11.9,0,0,0-16.9,0,8,8,0,0,1-11.3-11.4,28,28,0,0,1,19.8-8.2,28.4,28.4,0,0,1,19.8,8.2,11.9,11.9,0,0,0,16.9,0A8,8,0,0,1,245.9,114.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'ThermometerHotFill'

export const ThermometerHotFill = memo<IconProps>(themed(Icon))
