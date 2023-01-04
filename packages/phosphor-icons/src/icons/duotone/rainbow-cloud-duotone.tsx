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
        d="M152,200c-13.3,0-24-11.1-24-24.9s10.7-24.9,24-24.9a21.6,21.6,0,0,1,8.8,1.8h0A40,40,0,1,1,200,200Z"
        opacity="0.2"
      />
      <_Path
        d="M152,200c-13.3,0-24-11.1-24-24.9s10.7-24.9,24-24.9a21.6,21.6,0,0,1,8.8,1.8h0A40,40,0,1,1,200,200Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M16,176V160A96,96,0,0,1,178.9,91.2"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M48,176V160a64,64,0,0,1,101.9-51.6"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M80,176V160a32,32,0,0,1,32-32,30,30,0,0,1,7.4.9"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'RainbowCloudDuotone'

export const RainbowCloudDuotone = memo<IconProps>(themed(Icon))
