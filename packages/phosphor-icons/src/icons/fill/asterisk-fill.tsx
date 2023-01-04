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
      <_Path d="M208.2,165.1,144,128l64.2-37.1a8,8,0,1,0-8-13.8l-64.2,37V40a8,8,0,0,0-16,0v74.1l-64.2-37a8,8,0,0,0-8,13.8L112,128,47.8,165.1A8,8,0,0,0,44.9,176a7.7,7.7,0,0,0,6.9,4,7.3,7.3,0,0,0,4-1.1l64.2-37V216a8,8,0,0,0,16,0V141.9l64.2,37a7.3,7.3,0,0,0,4,1.1,7.7,7.7,0,0,0,6.9-4A8,8,0,0,0,208.2,165.1Z" />
    </_Svg>
  )
}

Icon.displayName = 'AsteriskFill'

export const AsteriskFill = memo<IconProps>(themed(Icon))
