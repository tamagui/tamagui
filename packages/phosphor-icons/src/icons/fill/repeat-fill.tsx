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
      <_Path d="M24,128A72.1,72.1,0,0,1,96,56h96V40a8,8,0,0,1,4.9-7.4,8.4,8.4,0,0,1,8.8,1.7l24,24a8.1,8.1,0,0,1,0,11.4l-24,24A8.3,8.3,0,0,1,200,96a8.5,8.5,0,0,1-3.1-.6A8,8,0,0,1,192,88V72H96a56,56,0,0,0-56,56,8,8,0,0,1-16,0Zm200-8a8,8,0,0,0-8,8,56,56,0,0,1-56,56H64V168a8,8,0,0,0-4.9-7.4,8.4,8.4,0,0,0-8.8,1.7l-24,24a8.1,8.1,0,0,0,0,11.4l24,24A8.3,8.3,0,0,0,56,224a8.5,8.5,0,0,0,3.1-.6A8,8,0,0,0,64,216V200h96a72.1,72.1,0,0,0,72-72A8,8,0,0,0,224,120Z" />
    </_Svg>
  )
}

Icon.displayName = 'RepeatFill'

export const RepeatFill = memo<IconProps>(themed(Icon))
