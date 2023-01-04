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
      <_Path d="M210,46a51.8,51.8,0,0,0-73.5,0L116.7,65.8A8,8,0,0,0,128,77.1l19.8-19.8a36.1,36.1,0,0,1,50.9,0,35.9,35.9,0,0,1,0,50.9l-28.3,28.3a36.1,36.1,0,0,1-50.9,0,8,8,0,1,0-11.3,11.3,52,52,0,0,0,73.5,0L210,119.5A51.8,51.8,0,0,0,210,46Z" />
      <_Path d="M128,178.9l-19.8,19.8a36,36,0,0,1-50.9-50.9l28.3-28.3a36.1,36.1,0,0,1,50.9,0,8,8,0,0,0,11.3-11.3,52,52,0,0,0-73.5,0L46,136.5A52,52,0,1,0,119.5,210l19.8-19.8A8,8,0,0,0,128,178.9Z" />
    </_Svg>
  )
}

Icon.displayName = 'LinkFill'

export const LinkFill = memo<IconProps>(themed(Icon))
