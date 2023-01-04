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
      <_Path d="M160,56H64A16,16,0,0,0,48,72V224a8.1,8.1,0,0,0,4.3,7.1,8.4,8.4,0,0,0,3.7.9,8.2,8.2,0,0,0,4.7-1.5L112,193.8l51.4,36.7a7.8,7.8,0,0,0,8.3.6A8.1,8.1,0,0,0,176,224V72A16,16,0,0,0,160,56Z" />
      <_Path d="M192,24H88a8,8,0,0,0,0,16H192V192a8,8,0,0,0,16,0V40A16,16,0,0,0,192,24Z" />
    </_Svg>
  )
}

Icon.displayName = 'BookmarksSimpleFill'

export const BookmarksSimpleFill = memo<IconProps>(themed(Icon))
