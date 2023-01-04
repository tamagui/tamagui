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
        d="M128,32a103.9,103.9,0,0,1,103.6,95.3,7.9,7.9,0,0,1-7.9,8.7H168c0-72-40-104-40-104"
        opacity="0.2"
      />
      <_Path
        d="M128,32A103.9,103.9,0,0,0,24.4,127.3a7.9,7.9,0,0,0,7.9,8.7H88c0-72,40-104,40-104"
        opacity="0.2"
      />
      <_Path
        d="M176,200a24,24,0,0,1-48,0V136"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M32.3,136a7.9,7.9,0,0,1-7.9-8.7,104,104,0,0,1,207.2,0,7.9,7.9,0,0,1-7.9,8.7Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Path
        d="M88,136c0-72,40-104,40-104s40,32,40,104"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'UmbrellaDuotone'

export const UmbrellaDuotone = memo<IconProps>(themed(Icon))
