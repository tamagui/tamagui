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
      <_Path d="M240.6,128a15.8,15.8,0,0,1-10.5,15l-63.9,23.2L143,230.1a16,16,0,0,1-30,0L89.8,166.2,25.9,143a16,16,0,0,1,0-30L89.8,89.8,113,25.9a16,16,0,0,1,30,0l23.2,63.9L230.1,113A15.8,15.8,0,0,1,240.6,128Z" />
    </_Svg>
  )
}

Icon.displayName = 'StarFourFill'

export const StarFourFill = memo<IconProps>(themed(Icon))
