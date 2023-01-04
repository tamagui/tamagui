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
        d="M122.7,25.9,42,42,25.9,122.7a8,8,0,0,0,2.2,7.2L132.5,234.3a7.9,7.9,0,0,0,11.3,0l90.5-90.5a7.9,7.9,0,0,0,0-11.3L129.9,28.1A8,8,0,0,0,122.7,25.9Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <_Circle cx="84" cy="84" r="8" />
    </_Svg>
  )
}

Icon.displayName = 'TagThin'

export const TagThin = memo<IconProps>(themed(Icon))
