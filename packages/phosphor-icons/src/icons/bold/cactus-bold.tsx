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
    <_Svg viewBox="0 0 256 256" {...otherProps} height={size} width={size}>
      <_Rect width="256" height="256" fill="none" />
      <_Line
        x1="40"
        y1="216"
        x2="216"
        y2="216"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
      <_Path
        d="M96,216V132H84A60,60,0,0,1,24,72h0A20.1,20.1,0,0,1,44,52h0A20.1,20.1,0,0,1,64,72h0A20.1,20.1,0,0,0,84,92H96V56a32,32,0,0,1,32-32h0a32,32,0,0,1,32,32v76h12a20.1,20.1,0,0,0,20-20h0a20.1,20.1,0,0,1,20-20h0a20.1,20.1,0,0,1,20,20h0a60,60,0,0,1-60,60H160v44"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
    </_Svg>
  )
}

Icon.displayName = 'CactusBold'

export const CactusBold = memo<IconProps>(themed(Icon))
