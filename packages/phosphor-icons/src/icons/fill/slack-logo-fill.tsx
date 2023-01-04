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
      <_Path d="M221.1,128A32,32,0,0,0,200,72a32.2,32.2,0,0,0-16,4.3V56a32,32,0,0,0-56-21.1A32,32,0,0,0,72,56a32.2,32.2,0,0,0,4.3,16H56a32,32,0,0,0-21.1,56A32,32,0,0,0,56,184a32.2,32.2,0,0,0,16-4.3V200a32,32,0,0,0,56,21.1A32,32,0,0,0,184,200a32.2,32.2,0,0,0-4.3-16H200a32,32,0,0,0,21.1-56ZM88,56a16,16,0,0,1,32,0V72H104A16,16,0,0,1,88,56ZM40,104A16,16,0,0,1,56,88h48a16,16,0,0,1,16,16v16H56A16,16,0,0,1,40,104Zm128,96a16,16,0,0,1-32,0V184h16A16,16,0,0,1,168,200Zm32-32H152a16,16,0,0,1-16-16V136h64a16,16,0,0,1,0,32Z" />
    </_Svg>
  )
}

Icon.displayName = 'SlackLogoFill'

export const SlackLogoFill = memo<IconProps>(themed(Icon))
