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
      <_Path d="M214.6,86.6A31.6,31.6,0,0,1,192,96a32.7,32.7,0,0,1-16.3-4.4L91.6,175.7a32,32,0,0,1-5,38.9,31.9,31.9,0,0,1-45.2,0,31.9,31.9,0,0,1,0-45.2h0a32,32,0,0,1,38.9-5l84.1-84.1a32,32,0,1,1,50.2,6.3Z" />
    </_Svg>
  )
}

Icon.displayName = 'LineSegmentFill'

export const LineSegmentFill = memo<IconProps>(themed(Icon))
