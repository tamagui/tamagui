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
        d="M71.9,65.4c-15.4,23.2-28,49.8-28,74.6a84,84,0,0,0,168,0c0-52-36-92-65.2-121.1h0L111.9,92l-40-26.6Z"
        opacity="0.2"
      />
      <_Path
        d="M71.9,65.4c-15.4,23.2-28,49.8-28,74.6a84,84,0,0,0,168,0c0-52-36-92-65.2-121.1h0L111.9,92l-40-26.6Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'FireSimpleDuotone'

export const FireSimpleDuotone = memo<IconProps>(themed(Icon))
