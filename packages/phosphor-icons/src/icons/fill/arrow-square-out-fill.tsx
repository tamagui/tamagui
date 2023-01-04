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
      <_Path d="M224,100a8,8,0,0,1-4.9,7.4,8.5,8.5,0,0,1-3.1.6,8.3,8.3,0,0,1-5.7-2.3L186,81.3l-36.4,36.4A8,8,0,0,1,144,120a8.3,8.3,0,0,1-5.7-2.3,8,8,0,0,1,0-11.3L174.7,70,150.3,45.7a8.4,8.4,0,0,1-1.7-8.8A8,8,0,0,1,156,32h60a8,8,0,0,1,8,8Zm-40,36a8,8,0,0,0-8,8v64H48V80h64a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V144A8,8,0,0,0,184,136Z" />
    </_Svg>
  )
}

Icon.displayName = 'ArrowSquareOutFill'

export const ArrowSquareOutFill = memo<IconProps>(themed(Icon))
