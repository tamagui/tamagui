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
      <_Rect x="72" y="32" width="112" height="192" rx="24" />
      <_Path d="M208,80a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V88A8,8,0,0,0,208,80Z" />
      <_Path d="M240,96a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V104A8,8,0,0,0,240,96Z" />
      <_Path d="M48,80a8,8,0,0,0-8,8v80a8,8,0,0,0,16,0V88A8,8,0,0,0,48,80Z" />
      <_Path d="M16,96a8,8,0,0,0-8,8v48a8,8,0,0,0,16,0V104A8,8,0,0,0,16,96Z" />
    </_Svg>
  )
}

Icon.displayName = 'VibrateFill'

export const VibrateFill = memo<IconProps>(themed(Icon))
