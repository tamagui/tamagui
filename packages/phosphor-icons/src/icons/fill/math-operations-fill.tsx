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
      <_Path d="M104,176H80V152a8,8,0,0,0-16,0v24H40a8,8,0,0,0,0,16H64v24a8,8,0,0,0,16,0V192h24a8,8,0,0,0,0-16Z" />
      <_Path d="M104,64H40a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Z" />
      <_Path d="M152,176.1h64a8,8,0,0,0,0-16H152a8,8,0,0,0,0,16Z" />
      <_Path d="M216,191.9H152a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Z" />
      <_Path d="M154.3,101.7a8.2,8.2,0,0,0,11.4,0L184,83.3l18.3,18.4a8.2,8.2,0,0,0,11.4,0,8.1,8.1,0,0,0,0-11.4L195.3,72l18.4-18.3a8.1,8.1,0,0,0-11.4-11.4L184,60.7,165.7,42.3a8.1,8.1,0,0,0-11.4,11.4L172.7,72,154.3,90.3A8.1,8.1,0,0,0,154.3,101.7Z" />
    </_Svg>
  )
}

Icon.displayName = 'MathOperationsFill'

export const MathOperationsFill = memo<IconProps>(themed(Icon))
