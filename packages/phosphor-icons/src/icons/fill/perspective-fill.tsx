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
      <_Path d="M32,120v16H16a8,8,0,0,1,0-16Zm0,57.3a16,16,0,0,0,13.1,15.8l160,29.1h0l2.9.2a16.5,16.5,0,0,0,10.3-3.7,16.1,16.1,0,0,0,5.7-12.3V136H32ZM240,120H224v16h16a8,8,0,0,0,0-16ZM224,49.6a16.1,16.1,0,0,0-5.7-12.3,16.6,16.6,0,0,0-13.2-3.5L45.1,62.9A16,16,0,0,0,32,78.7V120H224Z" />
    </_Svg>
  )
}

Icon.displayName = 'PerspectiveFill'

export const PerspectiveFill = memo<IconProps>(themed(Icon))
