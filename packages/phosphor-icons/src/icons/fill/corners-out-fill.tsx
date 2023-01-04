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
      <_Path d="M216,48V88a8,8,0,0,1-4.9,7.4,8.5,8.5,0,0,1-3.1.6,8.3,8.3,0,0,1-5.7-2.3l-40-40a8.4,8.4,0,0,1-1.7-8.8A8,8,0,0,1,168,40h40A8,8,0,0,1,216,48ZM53.7,162.3a8.4,8.4,0,0,0-8.8-1.7A8,8,0,0,0,40,168v40a8,8,0,0,0,8,8H88a8,8,0,0,0,7.4-4.9,8.4,8.4,0,0,0-1.7-8.8Zm157.4-1.7a8.4,8.4,0,0,0-8.8,1.7l-40,40a8.4,8.4,0,0,0-1.7,8.8A8,8,0,0,0,168,216h40a8,8,0,0,0,8-8V168A8,8,0,0,0,211.1,160.6ZM88,40H48a8,8,0,0,0-8,8V88a8,8,0,0,0,4.9,7.4A8.5,8.5,0,0,0,48,96a8.3,8.3,0,0,0,5.7-2.3l40-40a8.4,8.4,0,0,0,1.7-8.8A8,8,0,0,0,88,40Z" />
    </_Svg>
  )
}

Icon.displayName = 'CornersOutFill'

export const CornersOutFill = memo<IconProps>(themed(Icon))
