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
      <_Path d="M214.2,108.4l-73.3,23.8,45.3,62.3a8,8,0,1,1-12.9,9.4L128,141.6,82.7,203.9a8,8,0,1,1-12.9-9.4l45.3-62.3L41.8,108.4a8,8,0,0,1,5-15.2L120,117V40a8,8,0,0,1,16,0v77l73.2-23.8a8,8,0,0,1,5,15.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'AsteriskSimpleFill'

export const AsteriskSimpleFill = memo<IconProps>(themed(Icon))
