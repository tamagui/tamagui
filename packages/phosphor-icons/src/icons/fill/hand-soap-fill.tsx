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
      <_Path d="M184,96.8V88a32.1,32.1,0,0,0-32-32H136V32h32a8,8,0,0,1,8,8,8,8,0,0,0,16,0,24.1,24.1,0,0,0-24-24H104a8,8,0,0,0,0,16h16V56H104A32.1,32.1,0,0,0,72,88v8.8A40.1,40.1,0,0,0,40,136v80a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V136A40.1,40.1,0,0,0,184,96.8ZM104,72h48a16,16,0,0,1,16,16v8H88V88A16,16,0,0,1,104,72Z" />
    </_Svg>
  )
}

Icon.displayName = 'HandSoapFill'

export const HandSoapFill = memo<IconProps>(themed(Icon))
