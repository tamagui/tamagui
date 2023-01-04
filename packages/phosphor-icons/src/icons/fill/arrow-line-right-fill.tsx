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
      <_Path d="M189.7,122.3a8.1,8.1,0,0,1,0,11.4l-72,72A8.3,8.3,0,0,1,112,208a8.5,8.5,0,0,1-3.1-.6A8,8,0,0,1,104,200V136H32a8,8,0,0,1,0-16h72V56a8,8,0,0,1,4.9-7.4,8.4,8.4,0,0,1,8.8,1.7ZM216,32a8,8,0,0,0-8,8V216a8,8,0,0,0,16,0V40A8,8,0,0,0,216,32Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowLineRightFill'

export const ArrowLineRightFill = memo<IconProps>(themed(Icon))
