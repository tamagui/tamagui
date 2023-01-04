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
      <_G opacity="0.2">
        <_Path d="M102.4,198.4,57.6,153.6,37.9,207.9a7.9,7.9,0,0,0,10.2,10.2Z" />
      </_G>
      <_Path
        d="M76.8,100.8l78.4,78.4,41-14.9a8,8,0,0,0,2.9-13.2L104.9,56.9a8,8,0,0,0-13.2,2.9Z"
        opacity="0.2"
      />
      <_Path
        d="M37.9,207.9,91.7,59.8a8,8,0,0,1,13.2-2.9l94.2,94.2a8,8,0,0,1-2.9,13.2L48.1,218.1A7.9,7.9,0,0,1,37.9,207.9Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M168,72s0-24,24-24,24-24,24-24"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="102.4"
        y1="198.4"
        x2="57.6"
        y2="153.6"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="144"
        y1="16"
        x2="144"
        y2="40"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="216"
        y1="112"
        x2="232"
        y2="128"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="216"
        y1="80"
        x2="240"
        y2="72"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="76.8"
        y1="100.8"
        x2="155.2"
        y2="179.2"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'ConfettiDuotone'

export const ConfettiDuotone = memo<IconProps>(themed(Icon))
