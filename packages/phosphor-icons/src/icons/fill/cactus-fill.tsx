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
      <_Path d="M224,216a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H88V140H84A68.1,68.1,0,0,1,16,72a28,28,0,0,1,56,0A12,12,0,0,0,84,84h4V56a40,40,0,0,1,80,0v68h4a12,12,0,0,0,12-12,28,28,0,0,1,56,0,68.1,68.1,0,0,1-68,68h-4v28h48A8,8,0,0,1,224,216Z" />
    </_Svg>
  )
}

Icon.displayName = 'CactusFill'

export const CactusFill = memo<IconProps>(themed(Icon))
