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
        d="M14.5,121.3l89.2-57.4A8,8,0,0,1,116,70.7V185.3a8,8,0,0,1-12.3,6.8L14.5,134.7A7.9,7.9,0,0,1,14.5,121.3Z"
        opacity="0.2"
      />
      <_Path
        d="M126.5,121.3l89.2-57.4A8,8,0,0,1,228,70.7V185.3a8,8,0,0,1-12.3,6.8l-89.2-57.4A7.9,7.9,0,0,1,126.5,121.3Z"
        opacity="0.2"
      />
      <_Path
        d="M14.5,121.3l89.2-57.4A8,8,0,0,1,116,70.7V185.3a8,8,0,0,1-12.3,6.8L14.5,134.7A7.9,7.9,0,0,1,14.5,121.3Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M126.5,121.3l89.2-57.4A8,8,0,0,1,228,70.7V185.3a8,8,0,0,1-12.3,6.8l-89.2-57.4A7.9,7.9,0,0,1,126.5,121.3Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'RewindDuotone'

export const RewindDuotone = memo<IconProps>(themed(Icon))
