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
        d="M194.4,196.4,240,128,194.4,59.6a7.9,7.9,0,0,0-6.7-3.6H40a8,8,0,0,0-8,8V192a8,8,0,0,0,8,8H187.7A7.9,7.9,0,0,0,194.4,196.4Z"
        opacity="0.2"
      />
      <_Path
        d="M194.4,196.4,240,128,194.4,59.6a7.9,7.9,0,0,0-6.7-3.6H40a8,8,0,0,0-8,8V192a8,8,0,0,0,8,8H187.7A7.9,7.9,0,0,0,194.4,196.4Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'TagSimpleDuotone'

export const TagSimpleDuotone = memo<IconProps>(themed(Icon))
