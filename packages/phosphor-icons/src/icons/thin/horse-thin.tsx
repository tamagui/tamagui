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
        d="M176,120a48,48,0,0,1-48,48"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <_Path
        d="M64,199.6A95.6,95.6,0,0,0,129.9,224c51.5-1,93.4-43.1,94.1-94.6A96,96,0,0,0,128,32h-8V64L16,128l13.8,19.1a23.9,23.9,0,0,0,23.5,9.6c17.5-2.9,48.1-4.7,74.7,11.3h0L92.8,217.3"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <_Circle cx="124" cy="100" r="8" />
    </_Svg>
  )
}

Icon.displayName = 'HorseThin'

export const HorseThin = memo<IconProps>(themed(Icon))
