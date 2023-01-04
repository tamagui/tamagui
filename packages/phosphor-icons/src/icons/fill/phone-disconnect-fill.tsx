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
      <_Path d="M229.8,90.2C173.7,34,82.3,34,26.2,90.2a56.1,56.1,0,0,0-4.7,73.9,16.2,16.2,0,0,0,12.6,6.1,17.1,17.1,0,0,0,5.9-1.1l47.4-19a16,16,0,0,0,9.7-11.7l5.9-29.5a76.3,76.3,0,0,1,49.7-.1h0l6.2,29.7a15.9,15.9,0,0,0,9.7,11.6l47.4,19a16.1,16.1,0,0,0,18.5-5A56.1,56.1,0,0,0,229.8,90.2Z" />
      <_Path d="M216,192H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'PhoneDisconnectFill'

export const PhoneDisconnectFill = memo<IconProps>(themed(Icon))
