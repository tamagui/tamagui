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
      <_Path d="M221.7,133.7l-42,42A8.3,8.3,0,0,1,174,178a7.7,7.7,0,0,1-3-.6,8,8,0,0,1-5-7.4V136H104a8,8,0,0,1,0-16h62V86a8,8,0,0,1,5-7.4,8.2,8.2,0,0,1,8.7,1.7l42,42A8.1,8.1,0,0,1,221.7,133.7ZM104,208H48V48h56a8,8,0,0,0,0-16H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16h56a8,8,0,0,0,0-16Z" />
    </_Svg>
  )
}

Icon.displayName = 'SignOutFill'

export const SignOutFill = memo<IconProps>(themed(Icon))
