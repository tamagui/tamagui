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
      <_Path d="M240,101v64a8,8,0,0,1-4.1,7L142,225.3a4,4,0,0,1-6-3.5V164.7L191.8,133,224,151.3V114.7L191.8,133l-16.2-9.2L215.8,101,136,55.7v45.6l39.6,22.5-47.6,27-47.6-27L120,101.3V55.7L40.2,101l40.2,22.8L64.2,133,32,114.7v36.6L64.2,133,120,164.7v57.1a4,4,0,0,1-6,3.5L20.1,172a8,8,0,0,1-4.1-7V101a8,8,0,0,1,4.1-7l100-56.7a15.9,15.9,0,0,1,15.8,0L235.9,94A8,8,0,0,1,240,101Z" />
    </_Svg>
  )
}

Icon.displayName = 'CodepenLogoFill'

export const CodepenLogoFill = memo<IconProps>(themed(Icon))
