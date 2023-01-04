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
      <_Path d="M212,32V224a8,8,0,0,1-16,0V168H148a8.2,8.2,0,0,1-6-2.7,8.1,8.1,0,0,1-2-6.2,412.8,412.8,0,0,1,11.8-59.3c12-42.4,28.7-67.8,49.5-75.3A7.9,7.9,0,0,1,212,32ZM127.9,78.7l-8-48a8,8,0,1,0-15.8,2.6L110.6,72H92V32a8,8,0,0,0-16,0V72H57.4l6.5-38.7a8,8,0,1,0-15.8-2.6l-8,48h0A4.9,4.9,0,0,0,40,80a44.1,44.1,0,0,0,36,43.3V224a8,8,0,0,0,16,0V123.3A44.1,44.1,0,0,0,128,80a4.9,4.9,0,0,0-.1-1.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'ForkKnifeFill'

export const ForkKnifeFill = memo<IconProps>(themed(Icon))
