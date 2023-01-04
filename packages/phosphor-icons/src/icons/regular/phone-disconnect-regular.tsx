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
        d="M155.4,101.3a83.9,83.9,0,0,0-55.1.1,8,8,0,0,0-5.2,5.9l-5.8,29.5a8.2,8.2,0,0,1-4.9,5.9L37.1,161.6a7.9,7.9,0,0,1-9.3-2.5,48,48,0,0,1,4-63.3,136.1,136.1,0,0,1,192.4,0,48,48,0,0,1,4,63.3,7.9,7.9,0,0,1-9.3,2.5l-47.3-18.9a8.2,8.2,0,0,1-4.9-5.8l-6.2-29.7A7.9,7.9,0,0,0,155.4,101.3Z"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
      <_Line
        x1="40"
        y1="200"
        x2="216"
        y2="200"
        fill="none"
        stroke={`${color}`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="16"
      />
    </_Svg>
  )
}

Icon.displayName = 'PhoneDisconnectRegular'

export const PhoneDisconnectRegular = memo<IconProps>(themed(Icon))
