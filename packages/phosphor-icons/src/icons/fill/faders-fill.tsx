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
      <_Path d="M128,112a8,8,0,0,0-8,8v96a8,8,0,0,0,16,0V120A8,8,0,0,0,128,112Z" />
      <_Path d="M200,192a8,8,0,0,0-8,8v16a8,8,0,0,0,16,0V200A8,8,0,0,0,200,192Z" />
      <_Path d="M224,160H208V40a8,8,0,0,0-16,0V160H176a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Z" />
      <_Path d="M56,160a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V168A8,8,0,0,0,56,160Z" />
      <_Path d="M80,128H64V40a8,8,0,0,0-16,0v88H32a8,8,0,0,0,0,16H80a8,8,0,0,0,0-16Z" />
      <_Path d="M152,80H136V40a8,8,0,0,0-16,0V80H104a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'FadersFill'

export const FadersFill = memo<IconProps>(themed(Icon))
