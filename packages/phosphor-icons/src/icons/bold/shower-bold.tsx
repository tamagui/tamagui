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
      <_Circle cx="60" cy="228" r="16" />
      <_Circle cx="92" cy="196" r="16" />
      <_Circle cx="28" cy="196" r="16" />
      <_Circle cx="60" cy="164" r="16" />
      <_Path
        d="M244,40H219.3a7.9,7.9,0,0,0-5.6,2.3L184,72,64.4,86.1a8,8,0,0,0-4.7,13.6l96.6,96.6a8,8,0,0,0,13.6-4.7L184,72"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="24"
      />
    </_Svg>
  )
}

Icon.displayName = 'ShowerBold'

export const ShowerBold = memo<IconProps>(themed(Icon))
