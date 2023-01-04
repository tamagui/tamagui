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
      <_Path d="M232,92.7,163.3,24a16.1,16.1,0,0,0-22.6,0L115.6,49.1,57.5,70.9A15.9,15.9,0,0,0,47.4,83.2L26.6,207.8a4,4,0,0,0,6.8,3.5l55-55.1A31.7,31.7,0,0,1,84,140a32,32,0,1,1,32,32,31.7,31.7,0,0,1-16.2-4.4l-55.1,55a4,4,0,0,0,3.5,6.8l124.6-20.7a16.2,16.2,0,0,0,12.3-10.2l21.8-58.1L232,115.3a15.9,15.9,0,0,0,0-22.6Zm-32,32L131.3,56,152,35.3,220.7,104Z" />
      <_Circle cx="116" cy="140" r="16" />
    </_Svg>
  )
}

Icon.displayName = 'PenNibFill'

export const PenNibFill = memo<IconProps>(themed(Icon))
