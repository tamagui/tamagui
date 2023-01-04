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
        d="M18.5,188.7S72,163.9,72,80a56,56,0,0,1,112,0c0,83.9,53.5,108.7,53.5,108.7-9.3,8.7-29,3.4-40.2,9.5s-17,25.6-29.5,28.8S141,216,128,216s-27.7,14.1-39.8,11-18.5-22.7-29.5-28.8S27.8,197.4,18.5,188.7Z"
        opacity="0.2"
      />
      <_Path
        d="M18.5,188.7S72,163.9,72,80a56,56,0,0,1,112,0c0,83.9,53.5,108.7,53.5,108.7-9.3,8.7-29,3.4-40.2,9.5s-17,25.6-29.5,28.8S141,216,128,216s-27.7,14.1-39.8,11-18.5-22.7-29.5-28.8S27.8,197.4,18.5,188.7Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="189.3"
        y1="122.7"
        x2="216"
        y2="112"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="66.7"
        y1="122.7"
        x2="40"
        y2="112"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'SnapchatLogoDuotone'

export const SnapchatLogoDuotone = memo<IconProps>(themed(Icon))
