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
      <_Path
        d="M136,136a8,8,0,0,1,8,8,16,16,0,0,1-16,16,23.9,23.9,0,0,1-24-24,32,32,0,0,1,32-32,40,40,0,0,1,40,40,48,48,0,0,1-48,48,56,56,0,0,1-56-56,64.1,64.1,0,0,1,64-64,72,72,0,0,1,72,72,80,80,0,0,1-80,80,88,88,0,0,1-88-88,96,96,0,0,1,96-96A104,104,0,0,1,240,144"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'SpiralDuotone'

export const SpiralDuotone = memo<IconProps>(themed(Icon))
