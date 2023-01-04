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
        d="M224,120c-7.8,31.1-29,32.8-36.9,32.4h0A36,36,0,1,1,128,180a36,36,0,1,1-59.1-27.6h0c-7.9.4-29.1-1.3-36.9-32.4S17.1,48,48,48s80,48,80,80c0-32,49.1-80,80-80S232,88,224,120Z"
        opacity="0.2"
      />
      <_Line
        x1="128"
        y1="56"
        x2="128"
        y2="180"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M187.1,152.4c7.9.4,29.1-1.3,36.9-32.4s14.9-72-16-72-80,48-80,80c0-32-49.1-80-80-80S24,88,32,120s29,32.8,36.9,32.4"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M88,144.2A36,36,0,1,0,128,180a36,36,0,1,0,40-35.8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'ButterflyDuotone'

export const ButterflyDuotone = memo<IconProps>(themed(Icon))
