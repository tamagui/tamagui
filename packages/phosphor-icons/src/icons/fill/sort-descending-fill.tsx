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
      <_Path d="M231.4,91a8,8,0,0,1-7.4,5H192v48a8,8,0,0,1-16,0V96H144a8.1,8.1,0,0,1-7.4-4.9,8.4,8.4,0,0,1,1.7-8.8l40-40a8.1,8.1,0,0,1,11.4,0l40,40A8.2,8.2,0,0,1,231.4,91ZM48,136h72a8,8,0,0,0,0-16H48a8,8,0,0,0,0,16Zm0-64h56a8,8,0,0,0,0-16H48a8,8,0,0,0,0,16ZM184,184H48a8,8,0,0,0,0,16H184a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'SortDescendingFill'

export const SortDescendingFill = memo<IconProps>(themed(Icon))
