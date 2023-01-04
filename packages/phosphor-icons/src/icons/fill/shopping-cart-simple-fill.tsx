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
      <_Path d="M96,216a16,16,0,1,1-16-16A16,16,0,0,1,96,216Zm88-16a16,16,0,1,0,16,16A16,16,0,0,0,184,200ZM228.1,67.2a8.1,8.1,0,0,0-6.4-3.2H48.3L40.2,35.6A16.1,16.1,0,0,0,24.8,24H8A8,8,0,0,0,8,40H24.8l9.8,34.1v.2L61,166.6A24.1,24.1,0,0,0,84.1,184h95.8A24.1,24.1,0,0,0,203,166.6l26.4-92.4A8,8,0,0,0,228.1,67.2Z" />
    </_Svg>
  )
}

Icon.displayName = 'ShoppingCartSimpleFill'

export const ShoppingCartSimpleFill = memo<IconProps>(themed(Icon))
