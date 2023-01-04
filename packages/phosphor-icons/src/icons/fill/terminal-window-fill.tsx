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
      <_Path d="M215.5,39.5H40.5a17,17,0,0,0-17,17v143a17,17,0,0,0,17,17h175a17,17,0,0,0,17-17V56.5A17,17,0,0,0,215.5,39.5ZM121,134.2l-40,32a7.9,7.9,0,0,1-5,1.8,7.8,7.8,0,0,1-6.2-3A7.9,7.9,0,0,1,71,153.8L103.2,128,71,102.2A8,8,0,1,1,81,89.8l40,32a7.9,7.9,0,0,1,0,12.4ZM180,168H140a8,8,0,0,1,0-16h40a8,8,0,0,1,0,16Z" />
    </_Svg>
  )
}

Icon.displayName = 'TerminalWindowFill'

export const TerminalWindowFill = memo<IconProps>(themed(Icon))
