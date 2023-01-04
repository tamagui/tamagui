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
      <_Path d="M157.7,113.1a8,8,0,0,1,2.1-11.1l67.7-46.3a8,8,0,0,1,11.1,2.1,7.9,7.9,0,0,1-2.1,11.1l-67.6,46.3a7.8,7.8,0,0,1-4.6,1.4A8,8,0,0,1,157.7,113.1Zm80.9,85.1a7.9,7.9,0,0,1-6.6,3.5,8.2,8.2,0,0,1-4.5-1.4L136,137.7,93.5,166.8A36.4,36.4,0,0,1,96,180a36.1,36.1,0,1,1-11.6-26.4L121.8,128,84.4,102.4A35.5,35.5,0,0,1,60,112,36,36,0,1,1,93.5,89.2l143,97.9A7.9,7.9,0,0,1,238.6,198.2ZM80,180a19.7,19.7,0,0,0-5.9-14.1,19.8,19.8,0,0,0-28.2,0,19.8,19.8,0,0,0,0,28.2,19.9,19.9,0,0,0,28.2,0A19.7,19.7,0,0,0,80,180ZM74.1,90.1a19.8,19.8,0,0,0,0-28.2,19.8,19.8,0,0,0-28.2,0,19.8,19.8,0,0,0,0,28.2A19.9,19.9,0,0,0,74.1,90.1Z" />
    </_Svg>
  )
}

Icon.displayName = 'ScissorsFill'

export const ScissorsFill = memo<IconProps>(themed(Icon))
