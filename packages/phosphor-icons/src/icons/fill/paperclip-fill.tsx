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
      <_Path d="M209.7,122.3a8.1,8.1,0,0,1-.1,11.4l-82,81.9a56,56,0,0,1-79.2-79.2L147.7,35.8a40,40,0,1,1,56.6,56.5L105,192.9A23.8,23.8,0,0,1,88,200a24,24,0,0,1-17-41l83.3-84.6a8,8,0,1,1,11.4,11.2L82.4,170.3A8,8,0,0,0,80,176a8.1,8.1,0,0,0,13.7,5.7L192.9,81A23.8,23.8,0,0,0,200,64a24,24,0,0,0-41-17L59.8,147.7a40,40,0,1,0,56.5,56.6l82-82A8.1,8.1,0,0,1,209.7,122.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'PaperclipFill'

export const PaperclipFill = memo<IconProps>(themed(Icon))
