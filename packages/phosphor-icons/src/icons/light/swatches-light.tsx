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
      <_Path
        d="M36.7,173,60.9,35.9a7.9,7.9,0,0,1,9.2-6.5l55.2,9.7a8.1,8.1,0,0,1,6.5,9.3L107.5,186.3a36.1,36.1,0,0,1-41.1,29.3C46.5,212.4,33.2,192.9,36.7,173Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <_Path
        d="M118.3,124.8l72.9-26.5a8,8,0,0,1,10.3,4.8l19.2,52.6a8,8,0,0,1-4.8,10.2L84.3,213.8"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <_Path
        d="M220,162.5V208a8,8,0,0,1-8,8H72"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="12"
      />
      <_Circle cx="72" cy="180" r="10" />
    </_Svg>
  )
}

Icon.displayName = 'SwatchesLight'

export const SwatchesLight = memo<IconProps>(themed(Icon))
