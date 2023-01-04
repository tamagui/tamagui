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
      <_Path d="M112,144v51.6a8.1,8.1,0,0,1-2.9,6.2,7.8,7.8,0,0,1-5.1,1.8h-1.4l-64-11.6A8,8,0,0,1,32,184V144a8,8,0,0,1,8-8h64A8,8,0,0,1,112,144Zm-2.9-89.8a8,8,0,0,0-6.5-1.7l-64,11.6A8,8,0,0,0,32,72v40a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V60.4A8.1,8.1,0,0,0,109.1,54.2ZM216,136H136a8,8,0,0,0-8,8v57.5a8,8,0,0,0,6.6,7.8l80,14.6H216a7.4,7.4,0,0,0,5.1-1.9A7.9,7.9,0,0,0,224,216V144A8,8,0,0,0,216,136Zm5.1-102.1a7.7,7.7,0,0,0-6.5-1.8l-80,14.6a8,8,0,0,0-6.6,7.8V112a8,8,0,0,0,8,8h80a8,8,0,0,0,8-8V40A7.9,7.9,0,0,0,221.1,33.9Z" />
    </_Svg>
  )
}

Icon.displayName = 'WindowsLogoFill'

export const WindowsLogoFill = memo<IconProps>(themed(Icon))
