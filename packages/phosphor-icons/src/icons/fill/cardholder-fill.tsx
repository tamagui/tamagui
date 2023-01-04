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
      <_Path d="M208,48H48A24.1,24.1,0,0,0,24,72V184a24.1,24.1,0,0,0,24,24H208a24.1,24.1,0,0,0,24-24V72A24.1,24.1,0,0,0,208,48Zm-56.5,76.8a24,24,0,0,1-47,0A16.1,16.1,0,0,0,88.8,112H40V96H216v16H167.2A16.1,16.1,0,0,0,151.5,124.8ZM48,64H208a8,8,0,0,1,8,8v8H40V72A8,8,0,0,1,48,64Z" />
    </_Svg>
  )
}

Icon.displayName = 'CardholderFill'

export const CardholderFill = memo<IconProps>(themed(Icon))
