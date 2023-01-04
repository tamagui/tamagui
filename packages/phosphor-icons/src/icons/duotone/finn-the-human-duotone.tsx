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
        d="M208,40a23.9,23.9,0,0,0-24,24H72a24,24,0,0,0-48,0v80a64.1,64.1,0,0,0,64,64h80a64.1,64.1,0,0,0,64-64V64A23.9,23.9,0,0,0,208,40Zm-8,104a32,32,0,0,1-32,32H88a32,32,0,0,1-32-32v-8a32,32,0,0,1,32-32h80a32,32,0,0,1,32,32Z"
        opacity="0.2"
      />
      <_Rect
        x="56"
        y="104"
        width="144"
        height="72"
        rx="32"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M24,64a24,24,0,0,1,48,0H184a24,24,0,0,1,48,0v80a64.1,64.1,0,0,1-64,64H88a64.1,64.1,0,0,1-64-64Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Circle cx="92" cy="140" r="12" />
      <_Circle cx="164" cy="140" r="12" />
    </_Svg>
  )
}

Icon.displayName = 'FinnTheHumanDuotone'

export const FinnTheHumanDuotone = memo<IconProps>(themed(Icon))
