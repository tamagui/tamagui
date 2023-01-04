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
      <_Path d="M205.7,149.7l-72,72a8.2,8.2,0,0,1-11.4,0l-72-72a8.4,8.4,0,0,1-1.7-8.8A8,8,0,0,1,56,136h64V40a8,8,0,0,1,16,0v96h64a8,8,0,0,1,7.4,4.9A8.4,8.4,0,0,1,205.7,149.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowDownFill'

export const ArrowDownFill = memo<IconProps>(themed(Icon))
