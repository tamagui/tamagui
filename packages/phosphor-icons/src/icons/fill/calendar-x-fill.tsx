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
      <_Path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM157.7,170.3a8.1,8.1,0,0,1,0,11.4A8.5,8.5,0,0,1,152,184a8.3,8.3,0,0,1-5.7-2.3L128,163.3l-18.3,18.4A8.5,8.5,0,0,1,104,184a8.3,8.3,0,0,1-5.7-2.3,8.1,8.1,0,0,1,0-11.4L116.7,152,98.3,133.7a8.1,8.1,0,0,1,11.4-11.4L128,140.7l18.3-18.4a8.1,8.1,0,0,1,11.4,11.4L139.3,152ZM208,80H48V48H72v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24Z" />
    </_Svg>
  )
}

Icon.displayName = 'CalendarXFill'

export const CalendarXFill = memo<IconProps>(themed(Icon))
