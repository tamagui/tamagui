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
      <_Path d="M100,113.9,111.1,136H88.9ZM232,56V216a7.9,7.9,0,0,1-3.8,6.8,8,8,0,0,1-7.8.4L192,208.9l-28.4,14.3a8.5,8.5,0,0,1-7.2,0L128,208.9,99.6,223.2a8.3,8.3,0,0,1-7.2,0L64,208.9,35.6,223.2a8,8,0,0,1-7.8-.4A7.9,7.9,0,0,1,24,216V56A16,16,0,0,1,40,40H216A16,16,0,0,1,232,56ZM139.2,156.4l-32-64a8.1,8.1,0,0,0-14.4,0l-32,64a8,8,0,0,0,14.4,7.2L80.9,152h38.2l5.7,11.6A8.1,8.1,0,0,0,132,168a9.4,9.4,0,0,0,3.6-.8A8.2,8.2,0,0,0,139.2,156.4ZM204,128a8,8,0,0,0-8-8H184V108a8,8,0,0,0-16,0v12H156a8,8,0,0,0,0,16h12v12a8,8,0,0,0,16,0V136h12A8,8,0,0,0,204,128Z" />
    </_Svg>
  )
}

Icon.displayName = 'ExamFill'

export const ExamFill = memo<IconProps>(themed(Icon))
