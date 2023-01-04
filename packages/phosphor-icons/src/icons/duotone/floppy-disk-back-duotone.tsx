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
        d="M208,40H91.3a7.9,7.9,0,0,0-5.6,2.3L42.3,85.7A7.9,7.9,0,0,0,40,91.3V208a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V48A8,8,0,0,0,208,40ZM128,176a28,28,0,1,1,28-28A28,28,0,0,1,128,176Z"
        opacity="0.2"
      />
      <_Path
        d="M40,91.3V208a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V48a8,8,0,0,0-8-8H91.3a7.9,7.9,0,0,0-5.6,2.3L42.3,85.7A7.9,7.9,0,0,0,40,91.3Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Circle
        cx="128"
        cy="148"
        r="28"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Polyline
        points="96 80 160 80 160 40"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'FloppyDiskBackDuotone'

export const FloppyDiskBackDuotone = memo<IconProps>(themed(Icon))
