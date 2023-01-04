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
      <_Circle cx="128" cy="132" r="16" />
      <_Path d="M218.6,123.9,192,70.1V32a16,16,0,0,0-16-16H80A16,16,0,0,0,64,32V70.1L37.4,123.9a16.1,16.1,0,0,0,1.5,16.6l73.9,100.3a4,4,0,0,0,7.2-2.4V163a32,32,0,1,1,16,0v75.4a4,4,0,0,0,7.2,2.4l73.9-100.3A16.1,16.1,0,0,0,218.6,123.9ZM176,64H80V32h96Z" />
    </_Svg>
  )
}

Icon.displayName = 'PenNibStraightFill'

export const PenNibStraightFill = memo<IconProps>(themed(Icon))
