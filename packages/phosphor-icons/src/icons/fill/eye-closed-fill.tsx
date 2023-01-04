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
      <_Path d="M211.5,129.2a145.8,145.8,0,0,0,18.7-19.3A7.9,7.9,0,0,0,229,98.7a7.9,7.9,0,0,0-11.2,1.1,128.7,128.7,0,0,1-21.3,21h-.2c-16.5,12.8-39,23.1-68.3,23.1a109.7,109.7,0,0,1-68.4-23.1h-.1a128.7,128.7,0,0,1-21.3-21A7.9,7.9,0,0,0,27,98.7a7.9,7.9,0,0,0-1.2,11.2,145.8,145.8,0,0,0,18.7,19.3L25,163a8,8,0,0,0,6.9,12,8.2,8.2,0,0,0,6.9-4l18.5-32.1a122.1,122.1,0,0,0,35.3,16.3l-5.9,33a8.1,8.1,0,0,0,6.5,9.3h1.4a8,8,0,0,0,7.9-6.6l5.7-32.4A139.8,139.8,0,0,0,128,160a137.3,137.3,0,0,0,19.7-1.4l5.7,32.4a8,8,0,0,0,7.9,6.6h1.4a8.1,8.1,0,0,0,6.5-9.3l-5.8-32.9A122.9,122.9,0,0,0,198.6,139L217,170.8a8,8,0,0,0,7,4,7.6,7.6,0,0,0,4-1.1,8,8,0,0,0,2.9-10.9Z" />
    </_Svg>
  )
}

Icon.displayName = 'EyeClosedFill'

export const EyeClosedFill = memo<IconProps>(themed(Icon))
