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
      <_Path d="M238.6,78.6A31.6,31.6,0,0,1,216,88a32.2,32.2,0,0,1-7.6-.9l-26.7,49.4.9.9a31.9,31.9,0,0,1,0,45.2,31.9,31.9,0,0,1-45.2,0,32,32,0,0,1-5-38.9l-20.1-20.1A32.7,32.7,0,0,1,96,128a32.2,32.2,0,0,1-7.6-.9L61.7,176.5l.9.9a31.9,31.9,0,0,1,0,45.2,31.9,31.9,0,0,1-45.2,0,31.9,31.9,0,0,1,0-45.2h0a32.1,32.1,0,0,1,30.2-8.5l26.7-49.4-.9-.9a31.9,31.9,0,0,1,0-45.2h0a32,32,0,0,1,50.2,38.9l20.1,20.1a32.4,32.4,0,0,1,23.9-3.5l26.7-49.4-.9-.9a31.9,31.9,0,0,1,0-45.2h0a32,32,0,0,1,45.2,45.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'LineSegmentsFill'

export const LineSegmentsFill = memo<IconProps>(themed(Icon))
