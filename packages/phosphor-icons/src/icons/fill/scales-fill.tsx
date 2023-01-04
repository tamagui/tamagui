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
      <_Path d="M239.4,133l-32-80h0l-.5-.9h0l-.6-.8c-.1-.1-.1-.1-.1-.2l-.8-.8a.1.1,0,0,1-.1-.1l-.7-.5-.2-.2-.9-.5h-.2l-.8-.3h-.2l-1-.2h-3L136,62V40a8,8,0,0,0-16,0V65.6L54.3,80.2h-.7l-1,.4h-.2l-.8.4a.1.1,0,0,1-.1.1l-.9.7a.1.1,0,0,1-.1.1l-.6.7h-.1a2.4,2.4,0,0,0-.6.9l-.2.2-.4.9h-.1L16.6,165a8,8,0,0,0-.6,3c0,23.3,24.5,32,40,32s40-8.7,40-32a8,8,0,0,0-.6-3L66.9,93.8,120,82V208H104a8,8,0,0,0,0,16h48a8,8,0,0,0,0-16H136V78.4l50.9-11.3L160.6,133a8,8,0,0,0-.6,3c0,23.3,24.5,32,40,32s40-8.7,40-32A8,8,0,0,0,239.4,133ZM32.6,168,56,109.5,79.4,168Zm144-32L200,77.5,223.4,136Z" />
    </_Svg>
  )
}

Icon.displayName = 'ScalesFill'

export const ScalesFill = memo<IconProps>(themed(Icon))
