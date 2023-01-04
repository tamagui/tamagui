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
      <_Path d="M223.6,199.8,160,93.8V40h8a8,8,0,0,0,0-16H88a8,8,0,0,0,0,16h8V93.8L55.8,160.7c0,.1-.1.2-.1.3L32.4,199.8A16,16,0,0,0,46.1,224H209.9a16,16,0,0,0,13.7-24.2ZM109.7,102a15.9,15.9,0,0,0,2.3-8.2V40h32V93.8a15.9,15.9,0,0,0,2.3,8.2l38.8,64.8c-13.1,7.1-31.4,5.1-53.5-6-14.3-7.1-32.7-13.5-50.3-11.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'FlaskFill'

export const FlaskFill = memo<IconProps>(themed(Icon))
