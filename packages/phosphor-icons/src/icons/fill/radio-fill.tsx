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
      <_Path d="M216,72H86.5L194.3,39.7a8,8,0,1,0-4.6-15.4l-160,48h0l-.7.3h-.1l-.5.3H28a6.8,6.8,0,0,0-2.1,1.7.1.1,0,0,1-.1.1c-.1.1-.1.2-.2.4l-.2.2a.3.3,0,0,0-.1.2,6.7,6.7,0,0,0-1,2.3c-.1.1-.1.2-.1.4h-.1a2,2,0,0,1-.1.7h0V80h0V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72ZM96,184H56a8,8,0,0,1,0-16H96a8,8,0,0,1,0,16Zm0-32H56a8,8,0,0,1,0-16H96a8,8,0,0,1,0,16Zm0-32H56a8,8,0,0,1,0-16H96a8,8,0,0,1,0,16Zm72,52a28,28,0,1,1,28-28A28.1,28.1,0,0,1,168,172Z" />
    </_Svg>
  )
}

Icon.displayName = 'RadioFill'

export const RadioFill = memo<IconProps>(themed(Icon))
