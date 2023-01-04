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
      <_Path d="M211.2,79.4a8,8,0,0,0-3.8,10.7,88,88,0,1,1-23.1-29.7L161.5,83.2a56,56,0,0,0-73.1,84.4h0a56,56,0,0,0,95.5-42.8,7.9,7.9,0,0,0-8.4-7.5,8,8,0,0,0-7.6,8.4,40,40,0,0,1-62,35.7l24-24,37.7-37.7h0l62.1-62a8.1,8.1,0,0,0-11.4-11.4L195.7,49A104,104,0,0,0,54.5,54.5a103.8,103.8,0,0,0,0,147,103.8,103.8,0,0,0,147,0A104,104,0,0,0,221.9,83.2,8,8,0,0,0,211.2,79.4Z" />
    </_Svg>
  )
}

Icon.displayName = 'TargetFill'

export const TargetFill = memo<IconProps>(themed(Icon))
