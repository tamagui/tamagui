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
        d="M240.7,121.8,216,134.1,184,72.9l25-12.5a7.9,7.9,0,0,1,10.6,3.4l24.6,47.1A8,8,0,0,1,240.7,121.8Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <_Path
        d="M40,133.1,15.3,120.7a7.9,7.9,0,0,1-3.5-10.8L36.4,62.8A8,8,0,0,1,47,59.3L72,71.8Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <_Path
        d="M216,134.1l-16,18.8-36.8,36.8a8.5,8.5,0,0,1-7.6,2.1l-58-14.5a8,8,0,0,1-2.9-1.5L40,133.1"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <_Path
        d="M200,152.9l-44-32-12.8,9.6a32.1,32.1,0,0,1-38.4,0l-5.4-4.1a8.1,8.1,0,0,1-.9-12.1l39.2-39.1a7.9,7.9,0,0,1,5.6-2.3H184"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <_Path
        d="M72.6,71.8l51.3-15a8,8,0,0,1,5.5.4L164,72.9"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
      <_Path
        d="M112,212.9l-30.1-7.6a7.4,7.4,0,0,1-3.3-1.7L56,184"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="8"
      />
    </_Svg>
  )
}

Icon.displayName = 'HandshakeThin'

export const HandshakeThin = memo<IconProps>(themed(Icon))
