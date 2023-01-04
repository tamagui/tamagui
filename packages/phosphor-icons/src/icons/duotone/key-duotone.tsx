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
        d="M93.2,122.8A70.3,70.3,0,0,1,88,96a72,72,0,1,1,72,72,70.3,70.3,0,0,1-26.8-5.2h0L120,176H96v24H72v24H32V184l61.2-61.2Z"
        opacity="0.2"
      />
      <_Path
        d="M93.2,122.8A70.3,70.3,0,0,1,88,96a72,72,0,1,1,72,72,70.3,70.3,0,0,1-26.8-5.2h0L120,176H96v24H72v24H32V184l61.2-61.2Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Circle cx="180" cy="76" r="12" />
    </_Svg>
  )
}

Icon.displayName = 'KeyDuotone'

export const KeyDuotone = memo<IconProps>(themed(Icon))
