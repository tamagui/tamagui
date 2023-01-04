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
      <_Path d="M152,164v49.2a8.1,8.1,0,0,1-4.5,7.2,8.5,8.5,0,0,1-3.5.8,7.9,7.9,0,0,1-4.9-1.7l-19.1-15V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V168a16,16,0,0,1,16-16h56a16,16,0,0,1,16,16v4l19.2-14.4A8,8,0,0,1,152,164Zm64-76V216a16,16,0,0,1-16,16H168a8,8,0,0,1,0-16h32V96H152a8,8,0,0,1-8-8V40H56v80a8,8,0,0,1-16,0V40A16,16,0,0,1,56,24h96a8.1,8.1,0,0,1,5.7,2.3l56,56A8.1,8.1,0,0,1,216,88Zm-27.3-8L160,51.3V80Z" />
    </_Svg>
  )
}

Icon.displayName = 'FileVideoFill'

export const FileVideoFill = memo<IconProps>(themed(Icon))
